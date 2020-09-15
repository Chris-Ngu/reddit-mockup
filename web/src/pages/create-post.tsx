import { Box, Button } from '@chakra-ui/core';
import { Form, Formik } from 'formik';
import React from 'react';
import { InputField } from 'src/components/InputField';
import { Wrapper } from '../components/Wrapper';

const CreatePost: React.FC<{}> = ({ }) => {
    return (
        <Wrapper variant='small'>
            <Formik
                initialValues={{ title: "", text: "" }}
                onSubmit={async (value, { setErrors }) => {
                    console.log(value);
                }}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <InputField
                            name='title'
                            placeholder='title'
                            label='title'
                        />
                        <Box mt={4}>
                            <InputField
                                name='text'
                                placeholder='text...'
                                label='Body'
                            />
                        </Box>
                        <Button
                            type='submit'
                            variantColor='teal'
                            isLoading={isSubmitting}
                            mt={4}
                        >
                            Create Post
                    </Button>

                    </Form>
                )}
            </Formik>
        </Wrapper>
    )
}

export default CreatePost;
