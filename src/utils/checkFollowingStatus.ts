import { User } from '../configs/type';

export default function checkFollowingStatus(user: User | null, target: User) {
  let followingStatus = '';

  for (const request of target.requestPending) {
    if (request.id === user?.id) {
      followingStatus = 'pending';
      break;
    }
  }

  if (followingStatus) return followingStatus;

  for (const followedBy of target.followedBy) {
    if (followedBy.id === user?.id) {
      followingStatus = 'following';
      break;
    }
  }

  return followingStatus;
}
