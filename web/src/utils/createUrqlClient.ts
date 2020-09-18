import { __backend__ } from "../constants";

import { MeDocument, LoginMutation, MeQuery, CreateUserMutation, LogoutMutation } from 'src/generated/graphql';
import { dedupExchange, fetchExchange } from 'urql';
import { cacheExchange } from "@urql/exchange-graphcache";
import { betterUpdateQuery } from "./betterUpdateQuery";
import { pipe, tap } from 'wonka';
import { Exchange } from 'urql';
import Router from 'next/router';

const errorExchange: Exchange = ({ forward }) => (ops$) => {
    return pipe(
        forward(ops$),
        tap(({ error }) => {
            if (error?.message.includes("not authenticated")) {
                Router.replace("/login");
            }
        })
    );
};

export const createUrqlClient = (ssrExchange: any) => ({
    url: __backend__,
    fetchOptions: {
        credentials: "include" as const
    },
    exchanges: [dedupExchange, cacheExchange({
        updates: {
            Mutation: {
                login: (_result, _, cache, __) => {
                    betterUpdateQuery<LoginMutation, MeQuery>(
                        cache,
                        { query: MeDocument },
                        _result,
                        (result, query) => {
                            if (result.login.errors) {
                                return query;
                            } else {
                                return {
                                    me: result.login.user
                                };
                            }
                        }
                    );
                },
                logout: (_result, args, cache, info) => {
                    betterUpdateQuery<LogoutMutation, MeQuery>(
                        cache,
                        { query: MeDocument },
                        _result,
                        () => ({ me: null })
                    )
                },
                createUser: (_result, args, cache, info) => {
                    betterUpdateQuery<CreateUserMutation, MeQuery>(
                        cache,
                        { query: MeDocument },
                        _result,
                        (result, query) => {
                            if (result.createUser.errors) {
                                return query;
                            } else {
                                return {
                                    me: result.createUser.user
                                };
                            }
                        }
                    );
                },
            }
        }
    }),
        errorExchange,
        ssrExchange,
        fetchExchange]
})