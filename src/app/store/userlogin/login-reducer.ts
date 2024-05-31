import { createReducer, on } from '@ngrx/store';
import * as UserActions from './login-action';
import { User } from '../../model/auth';

export interface UserState {
  loading: boolean;
  error: string | null;
  user: User | null;
}

const initialState: UserState = {
  loading: false,
  error: null,
  user: null,
};

export const userReducer = createReducer(
  initialState,
  on(UserActions.userLogin, (state) => {
    console.log('Login user action dispatched');
    return { ...state, loading: true, error: null };
  }),

  on(UserActions.submitSuccess, (state, { successResponse }) => {
    console.log('state updated: ', successResponse);
    return { ...state, loading: false, user: successResponse };
  })
  //   on(UserActions.loginUserFailure, (state, { error }) => ({ ...state, loading: false, error }))
);
