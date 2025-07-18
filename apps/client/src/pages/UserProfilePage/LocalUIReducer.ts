export type LocalUIState = {
  avatarUploading: boolean;
  avatarVer: number;
  deleteDialogOpen: boolean;
};

export type LocalUIAction =
  | { type: 'SET_UPLOADING'; payload: boolean }
  | { type: 'INCREMENT_AVATAR_VER' }
  | { type: 'SET_DELETE_DIALOG'; payload: boolean };

export const initialLocalUIState: LocalUIState = {
  avatarUploading: false,
  avatarVer: 0,
  deleteDialogOpen: false,
};

export function localUIReducer(
  state: LocalUIState,
  action: LocalUIAction,
): LocalUIState {
  switch (action.type) {
    case 'SET_UPLOADING':
      return { ...state, avatarUploading: action.payload };
    case 'INCREMENT_AVATAR_VER':
      return { ...state, avatarVer: state.avatarVer + 1 };
    case 'SET_DELETE_DIALOG':
      return { ...state, deleteDialogOpen: action.payload };
    default:
      return state;
  }
}
