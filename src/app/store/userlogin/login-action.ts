import { createAction, props } from "@ngrx/store";
import { loginCredential, signupCredential } from "../../model/auth";


export const userSignup = createAction(
    '[User] signup Request',
    props<{userData : signupCredential }>()
)

export const userLogin = createAction(
    '[User] login Request',
    props<{userData : loginCredential }>()
)

export const submitSuccess = createAction(
    '[Submit] submit Success',
    props<{successResponse : any}>()
)

export const submitFail = createAction(
    '[Submit] submit failure',
    props<{error : string}>()
)