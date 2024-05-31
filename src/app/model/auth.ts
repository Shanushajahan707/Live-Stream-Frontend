export interface loginCredential {
  email: string;
  password: string;
}

export interface signupCredential {
  username: string;
  email: string;
  password: string;
  dateofbirth: Date;
}

export interface User {
  [x: string]: any;
  _id: string;
  username: string;
  email: string;
  password: string;
  exp: number;
  iat: number;
  role: string;
  dateofbirth: string;
  isblocked: boolean;
  googleId: number;
}
interface IsAdminResponse {
  isAdmin: boolean;
}

export interface LoginResponse {
  message: string;
  token: string;
  refreshToken:string
  isAdmin?: IsAdminResponse;
  userdata:User
}
export interface SignupResponse {
  message: string;
}

export interface OtpResponse {
  message: string;
}
export interface ResendResponse {
  message: string;
}
export interface GetUsersResponse {
  message: string;
  users: User[];
  totalcount:number
}
export interface Follower {
  username: string;
  userId: string; 
}

export interface ChannelData {
  _id: string;
  username: string;
  channelName: string;
  followers: Follower[];
  subscription: number;
  banner: string;
  video: {
    url: string;
    views: number;
  }[]; 
  lives: string[];
  isblocked: boolean;
}

export interface GetChannelResponse {
  message: string;
  channels: ChannelData[];
  totalcount:number
}
export interface GetChannelInfo {
  message: string;
  channeldata: ChannelData;
}
export interface EditChannelInterface {
  message: string;
  newChannelData: ChannelData;
}

export interface GetRecommededChannel {
  message: string;
  recommendedChannels: ChannelData[];
}
export interface GetFullFollowedChannel {
  message: string;
  follwedChannels: ChannelData[];
}

export interface GetFollowResponse{
  message:string;
  channel:ChannelData
}

export interface GetUserOne{
  userData:User
  message:string
}

export interface GetUploadResponse{
  message:string
  uploadOnDp:ChannelData
}