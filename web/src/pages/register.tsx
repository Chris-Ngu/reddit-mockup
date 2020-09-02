import React from 'react';
import { Formik, Form } from 'formik';
import { Input, FormControl, FormLabel, FormErrorMessage } from '@chakra-ui/core';
import { Wrapper } from 'src/components/Wrapper';

interface registerProps {

}

const Register: React.FC<registerProps> = ({ }) => {
    return (
        <Wrapper>
            <Formik
                initialValues={{ username: "", password: "" }}
                onSubmit={(value) => {
                    console.log(value);
                }}
            >

                {({ values, handleChange }) => (
                    <Form>
                        <FormControl>
                            <FormLabel htmlFor="username">Username</FormLabel>
                            <Input
                                value={values.username}
                                onChange={handleChange}
                                id="username"
                                placeholder="username"
                            />
                            {/* <FormErrorMessage>{format.errors.name}</FormErrorMessage> */}
                        </FormControl>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    );
}

export default Register;