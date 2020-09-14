import { Box, Button } from '@chakra-ui/core';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import React, { useState } from 'react';
import { InputField } from 'src/components/InputField';
import { Wrapper } from 'src/components/Wrapper';
import { useForgotPasswordMutation } from 'src/generated/graphql';
import { createUrqlClient } from 'src/utils/createUrqlClient';

const ForgotPassword: React.FC<{}> = ({ }) => {
    const [complete, setComplete] = useState(false);
    const [, forgotPassword] = useForgotPasswordMutation();

    return (
        <Wrapper variant='small'>
            <Formik
                initialValues={{ email: '' }}
                onSubmit={async (value) => {
                    await forgotPassword(value);
                    setComplete(true);
                }}
            >
                {({ isSubmitting }) =>
                    complete
                        ? (
                            <Box>
                                An email has been sent to that email
                            </Box>
                        )
                        : (
                            <Form>
                                <InputField
                                    name='email'
                                    placeholder='email'
                                    label='email'
                                    type='email'
                                />
                                <Button
                                    type='submit'
                                    variantColor='teal'
                                    isLoading={isSubmitting}
                                    mt={4}
                                >
                                    Submit
                                </Button>
                            </Form>
                        )
                }
            </Formik>
        </Wrapper>
    );
}

export default withUrqlClient(createUrqlClient, { ssr: false })(ForgotPassword);