import { MyContext } from '../../bot';

const isValidUser = (userID: number, validUserID: number) => userID === validUserID;

export const userPermissionGuard =
  (validUserID: number) =>
  (ctx: MyContext, next: () => Promise<void>): Promise<void> | undefined => {
    // @ts-expect-error проблема с типами в библиотеке
    const userID = ctx.update?.message?.from.id ?? ctx.update?.callback_query.from.id;

    if (!isValidUser(userID, validUserID)) {
      return;
    }

    return next();
  };
