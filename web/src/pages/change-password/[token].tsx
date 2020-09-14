import { Box, Button } from '@chakra-ui/core';
import { Form, Formik } from 'formik';
import { NextPage } from 'next';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { InputField } from 'src/components/InputField';
import { useChangePasswordMutation } from 'src/generated/graphql';
import { createUrqlClient } from 'src/utils/createUrqlClient';
import { toErrorMap } from 'src/utils/toErrorMap';
import { Wrapper } from '../../components/Wrapper';
import NextLink from 'next/link';


const ChangePassword: NextPage<{ token: string }> = ({ token }) => {
    const [, changePassword] = useChangePasswordMutation();
    const router = useRouter();
    const [tokenError, setTokenError] = useState('');

    return (
        <Wrapper variant='small'>
            <Formik
                initialValues={{ newPassword: '' }}
                onSubmit={async (value, { setErrors }) => {
                    const reponse = await changePassword({ newPassword: value.newPassword, token });
                    if (reponse.data?.ChangePassword.errors) {
                        const errorMap = toErrorMap(reponse.data.ChangePassword.errors);
                        if ('token' in errorMap) {
                            setTokenError(errorMap.token);
                        }
                        setErrors(errorMap);

                    } else if (reponse.data?.ChangePassword.user) {
                        router.push('/');
                    }

                }}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <InputField
                            name='newPassword'
                            placeholder='new password'
                            label='New Password'
                            type="password"
                        />

                        {tokenError
                            ?
                            (
                                <Box>
                                    <Box color='tomato'>
                                        {tokenError}
                                    </Box>
                                    <NextLink href='/forgot-password'>
                                        Please request another reset
                                    </NextLink>
                                </Box>
                            )
                            : null
                        }

                        <Button
                            mt={4}
                            type="submit"
                            isLoading={isSubmitting}
                            variantColor="teal"
                        >
                            Submit
                        </Button>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    )
}

ChangePassword.getInitialProps = ({ query }) => {
    return {
        token: query.token as string
    }
}

export default withUrqlClient(createUrqlClient)(ChangePassword);