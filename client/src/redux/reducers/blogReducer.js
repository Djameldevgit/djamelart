const initialState = {
  comments: [],
  loading: false,
  error: null,
};

export default function blogReducer(state = initialState, action) {
  switch(action.type) {
    case 'BLOG_GET_COMMENTS_REQUEST':
      return { ...state, loading: true };
    case 'BLOG_GET_COMMENTS_SUCCESS':
      return { ...state, loading: false, comments: action.payload };
    case 'BLOG_GET_COMMENTS_FAIL':
      return { ...state, loading: false, error: action.payload };
      case 'BLOG_CREATE_COMMENT_SUCCESS':
        return { ...state, comments: [...state.comments, action.payload] }
    case 'BLOG_NEW_COMMENT_WS':
      return { ...state, comments: [...state.comments, action.payload] };
    case 'BLOG_REPLY_WS':
      return {
        ...state,
        comments: state.comments.map(comment =>
          comment._id === action.payload.commentId
          ? {...comment, replies: [...(comment.replies || []), action.payload.reply]}
          : comment
        )
      };
    case 'BLOG_UPDATE_WS':
      return {
        ...state,
        comments: state.comments.map(comment =>
          comment._id === action.payload.commentId
          ? {...comment, text: action.payload.text}
          : comment
        )
      };
    case 'BLOG_DELETE_WS':
      return {
        ...state,
        comments: state.comments.filter(comment => comment._id !== action.payload)
      };
    default:
      return state;
  }
}

  