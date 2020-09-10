import React from 'react';
import { Formik, Form } from 'formik';
import { Wrapper } from 'src/components/Wrapper';
import { InputField } from 'src/components/InputField';
import { Box, Button } from '@chakra-ui/core';
import { useLoginMutation } from 'src/generated/graphql';
import { useRouter } from 'next/router';

import { toErrorMap } from '../utils/toErrorMap';
import { createUrqlClient } from 'src/utils/createUrqlClient';
import { withUrqlClient } from 'next-urql';

const Login: React.FC<{}> = ({ }) => {
    const router = useRouter();
    const [, login] = useLoginMutation();

    return (
        <Wrapper variant='small'>
            <Formik
                initialValues={{ usernameOrEmail: "", password: "" }}
                onSubmit={async (value, { setErrors }) => {
                    const response = await login(value);
                    if (response.data?.login.errors) {
                        setErrors(toErrorMap(response.data.login.errors));
                    } else if (response.data?.login.user) {
                        router.push('/');
                    }
                }}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <InputField
                            name='usernameOrEmail'
                            placeholder='username or email'
                            label='username or Email'
                        />
                        <Box mt={4}>
                            <InputField
                                name='password'
                                placeholder='password'
                                label='Password'
                                type='password'
                            />
                        </Box>
                        <Button
                            type='submit'
                            variantColor='teal'
                            isLoading={isSubmitting}
                            mt={4}
                        >
                            Login
                        </Button>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    );
}

export default withUrqlClient(createUrqlClient)(Login);