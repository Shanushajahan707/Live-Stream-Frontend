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
export interface BlockUserResponse {
  message: string;
  user: User;
}

export interface LoginResponse {
  message: string;
  token: string;
  refreshToken: string;
  isAdmin?: IsAdminResponse;
  userdata: User;
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
  totalcount: number;
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
    _id?: string;
  }[];
  isLive: boolean;
  lastDateOfLive: Date;
  isblocked: boolean;
  liveRoom?: string;
}
export interface SubscriptionData {
  _id: string;
  month: number;
  price: number;
}

export interface ChannelSubscriptionData {
  _id: string;
  month: number;
  price: number;
  description: { desc: string }[];
}
export interface ChannelSubscriptionDataAdminResponse {
  _id: string;
  month: number;
  price: number;
  description: { desc: string }[];
}
export interface WebsiteSubscriptionData {
  _id: string;
  month: number;
  price: number;
  description: { desc: string }[];
}
export interface WebsiteSubscriptionDataAdminResponse {
  message: string;
  plan: SubscriptionData[];
}
export interface WebsiteSubscriptionInsertionResponse {
  message: string;
  newplan: SubscriptionData[];
}
export interface GetallWebsiteSubscriptionAdminResponse {
  message: string;
  plan: SubscriptionData[];
}
export interface GetallChannelSubscriptionAdminResponse {
  message: string;
  plan: ChannelSubscriptionData[];
}
export interface ChannelSubscriptionInsertionResponse {
  message: string;
  plan: SubscriptionData[];

} 
export interface AdminWebsiteNembership {
  message: string;
  members: AdminWalletSummary[];
  wallet:number
}

export interface WebsiteSubscriptionResponse {
  websiteSubscription: WebsiteSubscriptionData[];
  message: string;
}
export interface ChannelSubscriptionResponse {
  channelPlans: ChannelSubscriptionData[];
  message: string;
}
export interface IsChannelSubscribedMemberResponse {
  isMember: boolean;
  message: string;
}
export interface ChannelSubscriptionResponse {
  isMember: boolean;
  payment: boolean;
  message: string;
}
export interface WebsiteSubscriptionResponse {
  isMember: boolean;
  payment: boolean;
  message: string;
}
export interface WebsiteTrailOverResponse {
  isTrailOver: boolean;
  message: string;
}
export interface MonthlySubscription {
  [key: string]: number;
}
export interface individualMonthlySubscription {
  [key: string]: { [key: string]: number }
}
export interface MonthlySubscriptionAdminDash {
  message: string;
  monthlySubscription: MonthlySubscription;
  individualPlanSubscriptions:individualMonthlySubscription
}
export interface MonthlySubscriptionChartResponse {
  revenue: MonthlySubscription;
  totalAmount:number
  message: string;
}

export interface ChannelSubscriptionUsers {
  _id: string;
  members: {
    userId: string;
    userChannelId: string;
    channelPlanId: string;
  };
  createdAt: Date;
}
export interface LiveHistory {
  readonly _id?: string;
  channelId: {
    channelName:string
  };
  startDate: Date;
  startTime: Date;
  endTime: Date;
  roomId: number;
  streamerName: User["_id"];
  viewerIds: {
    username: string;
  }[];
  liveName:string
  viewerCount: number[];
  duration: number;
  viewerNames?: string; // New field to hold the concatenated viewer names

}

export interface LiveHistoryResponse{
  liveHistory:LiveHistory[]
  message:string
}



export interface ChannelSubscriptionMembers {
  members: ChannelSubscriptionUsers[];
  totalcount: number;
  message: string;
}
export interface LiveUpdateResponse {
  liveId: string;
  message: string;
}

export interface DashboardUserCount {
  message: string;
  userCount: number;
}
export interface DashboardChannelCount {
  message: string;
  channelCount: number;
}

export interface AdminWalletSummary {
  _id: string;
  adminId: string;
  userId: {
    username: string;
  };
  amount: number;
  createdAt: Date;
  month: number;
  endsIn: Date;
}

export interface GetChannelResponse {
  message: string;
  channels: ChannelData[];
  totalcount: number;
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

export interface GetFollowResponse {
  message: string;
  channel: ChannelData;
}
export interface GetFollowResponseForHome {
  message: string;
  channel: string[];
}
export interface GetTopChannelResponse {
  message: string;
  channel: GetTrendingChannelResponse[];
}

export interface GetTrendingChannelResponse {
  channelName: string;
  banner: string;
  username:string,
  followersCount: number;
}


export interface GetUserOne {
  userData: User;
  message: string;
}

export interface GetUploadResponse {
  message: string;
  uploadOnDp: ChannelData;
}
export interface GetUpdateViewsResponse {
  [x: string]: any;
  message: string;
  channel: ChannelData;
}

export interface GetIsBlockedResponse {
  message: string;
  isBlocked: boolean;
}

export interface GetRefreshTokenResponse {
  message: string;
  accessToken: boolean;
}
export interface GetSearchChannelResponse {
  message: string;
  channels: ChannelData[];
}

export interface GetForgotPassResponse {
  message: string;
  email: string;
}
export interface GetForgotPassOtpResponse {
  message: string;
  otpvalue: boolean;
}
export interface GetChangePasswordResponse {
  message: string;
}
export interface GetUpdateLiveInfoResponse {
  message: string;
}
export interface GetRecommmendedLivesReponse {
  message: string;
  recommendedLives: ChannelData[];
}

export interface Dataset {
  label: string;
  data: number[];
  fill: boolean;
  borderColor: string;
  tension: number;
}

export interface OverallData {
  labels: string[];
  datasets: Dataset[];
}

export interface individualData {
  labels: string[];
  datasets: Dataset[];
}



export interface ChatMessage {
  username: string;
  message: string;
  timestamp: string;
  type: 'text' | 'audio';
  audioUrl?: string;

}

export interface Message {
  username: string;
  message: string;
  timestamp: Date;
  type: 'text' | 'audio';
  audioUrl?: string;
}

