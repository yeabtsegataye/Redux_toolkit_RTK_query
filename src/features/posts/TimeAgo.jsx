import { parseISO, formatDistanceToNow } from 'date-fns';

import React from 'react'

function TimeAgo({ timestamp }) {
    let TimeAgo = ''
    if (timestamp) {
        const date = parseISO(timestamp);
        const timePeriod = formatDistanceToNow(date)
        TimeAgo = `${timePeriod} ago`
    }
    return (
        <span title={timestamp}>
            &nbsp; <i>{timestamp}</i>
        </span>
    )
}

export default TimeAgo