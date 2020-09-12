import { Box, Button } from '@chakra-ui/core';
import { Form, Formik } from 'formik';
import { NextPage } from 'next';
import React from 'react';
import { InputField } from 'src/components/InputField';
import { toErrorMap } from 'src/utils/toErrorMap';
import { Wrapper } from '../../components/Wrapper';
import login from '../login';


const ChangePassword: NextPage<{ token: string }> = ({ token }) => {
    return (
        <Wrapper variant='small'>
            <Formik
                initialValues={{ newPassword: '' }}
                onSubmit={async (value, { setErrors }) => {

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
                        <Button
                            mt={4}
                            type="submit"
                            isLoading={isSubmitting}
                            variantColor="teal"
                        >
                            Submit
                        </Button>
                    </Form>
            </Formik>
        </Wrapper>
    )
}

ChangePassword.getInitialProps = ({ query }) => {
    return {
        token: query.token as string
    }
}

export default ChangePassword