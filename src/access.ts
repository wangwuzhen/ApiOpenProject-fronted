/**
 * @see https://umijs.org/docs/max/access#access
 * */

//权限管理机制
export default function access(initialState: InitialState| undefined) {
  const { loginUser } = initialState ?? {};
  return {
    canUser:loginUser,
    canAdmin: loginUser?.userRole === 'admin',
  };
}
