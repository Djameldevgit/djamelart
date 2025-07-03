const Conversations = require('../models/conversationModel')
const Messages = require('../models/messageModel')

class APIfeatures {
    constructor(query, queryString){
        this.query = query;
        this.queryString = queryString;
    }

    paginating(){
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 9
        const skip = (page - 1) * limit
        this.query = this.query.skip(skip).limit(limit)
        return this;
    }
}

const messageCtrl = {
    /*Función createMessage(petición, respuesta):

    Intentar lo siguiente:

        1. Extraer los datos del cuerpo de la petición:
           - remitente (sender)
           - destinatario (recipient)
           - texto (text)
           - archivos o imágenes (media)
           - llamada (call)

        2. Verificar si el destinatario existe Y si hay algún contenido:
           - Si NO hay destinatario, o NO hay texto, media o llamada:
               - Salir de la función (no hacer nada).

        3. Buscar si ya existe una conversación entre estos dos usuarios:
           - Buscar en la base de datos una conversación donde:
               - los participantes sean [sender, recipient] o [recipient, sender]
           - Si existe, usarla.
           - Si no existe, crear una nueva conversación con:
               - esos dos participantes
               - el texto, media y llamada actuales como resumen

        4. Crear un nuevo mensaje con los siguientes datos:
           - ID de la conversación encontrada o creada
           - remitente
           - destinatario
           - texto
           - media
           - llamada (si aplica)

        5. Guardar el mensaje en la base de datos.

        6. Enviar respuesta al cliente con mensaje de éxito.

    Si ocurre un error:
        - Enviar respuesta al cliente con el mensaje del error.
*/
    createMessage: async (req, res) => {
        try {
            const { sender, recipient, text, media, call } = req.body

            if (!recipient || (!text.trim() && media.length === 0 && !call)) return;

            const newConversation = await Conversations.findOneAndUpdate({
                $or: [
                    { recipients: [sender, recipient] },
                    { recipients: [recipient, sender] }
                ]
            }, {
                recipients: [sender, recipient],
                text, media, call
            }, { new: true, upsert: true })

            const newMessage = new Messages({
                conversation: newConversation._id,
                sender, call,
                recipient, text, media
            })

            await newMessage.save()

            res.json({ msg: req.__('message.create_success') })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },

    getConversations: async (req, res) => {
        try {
            const features = new APIfeatures(Conversations.find({
                recipients: req.user._id
            }), req.query).paginating()

            const conversations = await features.query.sort('-updatedAt')
            .populate('recipients', 'avatar username fullname lastDisconnectedAt')


            res.json({
                conversations,
                result: conversations.length
            })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },

    getMessages: async (req, res) => {
        try {
            const features = new APIfeatures(Messages.find({
                $or: [
                    { sender: req.user._id, recipient: req.params.id },
                    { sender: req.params.id, recipient: req.user._id }
                ]
            }), req.query).paginating()

            const messages = await features.query.sort('-createdAt')

            res.json({
                messages,
                result: messages.length
            })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },

    deleteMessages: async (req, res) => {
        try {
            await Messages.findOneAndDelete({ _id: req.params.id, sender: req.user._id })
            res.json({ msg: req.__('message.delete_success') })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },

    deleteConversation: async (req, res) => {
        try {
            const newConver = await Conversations.findOneAndDelete({
                $or: [
                    { recipients: [req.user._id, req.params.id] },
                    { recipients: [req.params.id, req.user._id] }
                ]
            })
            await Messages.deleteMany({ conversation: newConver._id })

            res.json({ msg: req.__('message.delete_success') })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
}

module.exports = messageCtrl
