import { __backend__ } from "../constants";

import { MeDocument, LoginMutation, MeQuery, CreateUserMutation, LogoutMutation } from 'src/generated/graphql';
import { dedupExchange, fetchExchange } from 'urql';
import { cacheExchange } from "@urql/exchange-graphcache";
import { betterUpdateQuery } from "./betterUpdateQuery";

export const createUrqlClient = (ssrExchange: any) => ({
    url: __backend__,
    fetchOptions: {
        credentials: "include" as const
    },
    exchanges: [dedupExchange, cacheExchange({
        updates: {
            Mutation: {
                login: (_result, args, cache, info) => {
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
        ssrExchange,
        fetchExchange]
})