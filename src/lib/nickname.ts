export const NICKNAME_MAX_LENGTH = 24;

// Mirrors the placeholder written by the on_auth_user_created trigger:
// 'Player_' || left(new.id::text, 12).
export function placeholderNickname(userId: string) {
  return `Player_${userId.slice(0, 12)}`;
}

export function isPlaceholderNickname(nickname: string, userId: string) {
  return nickname === placeholderNickname(userId);
}
