import { Box, Button } from '@chakra-ui/core';
import { Form, Formik } from 'formik';
import React from 'react';
import { InputField } from 'src/components/InputField';
import { Layout } from '../components/Layout';
import { useCreatePostMutation } from '../generated/graphql';
import { useRouter } from 'next/router';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from 'src/utils/createUrqlClient';
import { useIsAuth } from 'src/utils/useIsAuth';

const CreatePost: React.FC<{}> = ({ }) => {
    const [, createPost] = useCreatePostMutation();
    const router = useRouter();
    useIsAuth();
    return (
        <Layout variant="small">
            <Formik
                initialValues={{ title: "", text: "" }}
                onSubmit={async (value) => {
                    const { error } = await createPost({ input: value });
                    // if (error?.message.includes('not authenticated')) {
                    //     router.push('/register')
                    // }
                    if (!error) {
                        router.push('/');
                    }
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
                                textarea
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
        </Layout>
    )
}

export default withUrqlClient(createUrqlClient)(CreatePost);
