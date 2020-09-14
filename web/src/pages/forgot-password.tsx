import { withUrqlClient } from 'next-urql';
import React from 'react';
import { createUrqlClient } from 'src/utils/createUrqlClient';

const ForgotPassword: React.FC<{}> = ({ }) => {
    return (
        <div>
            Forgot-password page
        </div>
    );
}

export default withUrqlClient(createUrqlClient, { ssr: false })(ForgotPassword);