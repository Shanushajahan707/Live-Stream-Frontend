import { createSelector, createFeatureSelector } from '@ngrx/store';
import { UserState } from './login-reducer';

export const selectUserState = createFeatureSelector<UserState>('user');

export const selectUser = createSelector(
  selectUserState,
  (state: UserState) => {
    console.log('User state:', state);
    return state.user
  }
);