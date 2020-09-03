import React from 'react';
import { Formik, Form } from 'formik';
import { Input, FormControl, FormLabel, FormErrorMessage, Box, Button } from '@chakra-ui/core';
import { Wrapper } from 'src/components/Wrapper';
import { InputField } from 'src/components/InputField';

interface registerProps {

}

const Register: React.FC<registerProps> = ({ }) => {
    return (
        <Wrapper variant='small'>
            <Formik
                initialValues={{ username: "", password: "" }}
                onSubmit={(value) => {
                    console.log(value);
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
                        >Register</Button>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    );
}

export default Register;