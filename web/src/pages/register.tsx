import React from 'react';
import { Formik, Form } from 'formik';
import { Wrapper } from 'src/components/Wrapper';
import { InputField } from 'src/components/InputField';
import { Box, Button } from '@chakra-ui/core';
import { useCreateUserMutation } from 'src/generated/graphql';
import { useRouter } from 'next/router';

import { toErrorMap } from '../utils/toErrorMap';
import { createUrqlClient } from 'src/utils/createUrqlClient';
import { withUrqlClient } from 'next-urql';

interface registerProps {

}

const Register: React.FC<registerProps> = ({ }) => {
    const router = useRouter();
    const [, register] = useCreateUserMutation();

    return (
        <Wrapper variant='small'>
            <Formik
                initialValues={{ email: "", username: "", password: "" }}
                onSubmit={async (value, { setErrors }) => {
                    const registerReponse = await register({ options: value });
                    if (registerReponse.data?.createUser.errors) {
                        setErrors(toErrorMap(registerReponse.data.createUser.errors));
                    } else if (registerReponse.data?.createUser.user) {
                        router.push('/');
                    }
                }}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <InputField
                            name='username'
                            placeholder='username'
                            label='Username'
                        />
                        <Box mt={4}>
                            <InputField
                                name='email'
                                placeholder='email'
                                label='email'
                                type='email'
                            />
                        </Box>
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
                            Register
                        </Button>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    );
}

export default withUrqlClient(createUrqlClient)(Register);