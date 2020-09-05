import React from 'react';
import { Box, Link, Flex, Button } from '@chakra-ui/core';
import NextLink from 'next/link';
import { useMeQuery } from 'src/generated/graphql';

interface NavProps {

}

export const Nav: React.FC<NavProps> = ({ }) => {
    const [{ data, fetching }] = useMeQuery();
    let body = null

    if (fetching) {
        // user is loading
    } else if (!data?.me) {
        // user not logged in
        body = (
            <>
                <NextLink href='/login'>
                    <Link color='white' mr={2} >Login</Link>
                </NextLink>
                <NextLink href='/register'>
                    <Link color='white'>register</Link>
                </NextLink>
            </>
        )
    } else {
        // user logged in 
        body = (
            <Box>
                <Box>
                    {data.me.username}
                </Box>
                <Button variant="link">
                    logout
                </Button>
            </Box>
        )
    }

    return (
        <Flex bg="tomato" p={4}>
            <Box ml={'auto'}>
                {body}
            </Box>
        </Flex>
    )
}