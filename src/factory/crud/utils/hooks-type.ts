import { onResponseAsyncHookHandler, onSendAsyncHookHandler, preHandlerAsyncHookHandler } from 'fastify';

export type THooks = {
  preHandler?: preHandlerAsyncHookHandler[];
  onSend?: onSendAsyncHookHandler<any, any, any, any>[];
  onResponse?: onResponseAsyncHookHandler<any, any, any, any>[];
};
