import * as React from 'react';

export class ErrorBoundary extends React.Component<{}, {}> {
    render() {
        const { children } = this.props;

        return children;
    }

    componentDidCatch(error, info) {
        console.error(error);
        console.error(info);
    }
}
