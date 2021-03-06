import React from 'react';
import { Box, Link, Flex, Button } from '@chakra-ui/core';
import NextLink from 'next/link';
import { useMeQuery, useLogoutMutation } from 'src/generated/graphql';
import { isServer } from 'src/utils/isServer';

interface NavProps {

}

export const Nav: React.FC<NavProps> = ({ }) => {
    const [{ data, fetching }] = useMeQuery({
        pause: isServer()
    });
    const [{ fetching: logoutFetching }, logout] = useLogoutMutation();

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
            <Flex>
                <Box mr={2}>
                    {data.me.username}
                </Box>
                <Button
                    variant="link"
                    onClick={() => logout()}
                    isLoading={logoutFetching}
                >
                    logout
                </Button>
            </Flex>
        )
    }

    return (
        <Flex zIndex={1} position="sticky" top={0} bg="tan" p={4}>
            <Box ml={'auto'}>
                {body}
            </Box>
        </Flex>
    )
}