import React from "react";

export const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export const formatDateTime = (dateTimeString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Date(dateTimeString).toLocaleDateString('en-US', options);
    return formattedDate;
};

export function isURL(text) {
    const urlPattern = /([a-zA-Z]+:\/\/[^\s]+)/;
    return urlPattern.test(text);
}

export const replaceLinksAndSplitLines = (text) => {
    // Biểu thức chính quy để tìm các liên kết trong văn bản
    const linkRegex = /(https?:\/\/[^\s]+)/g;

    // Phân tích văn bản và thay thế các liên kết bằng thẻ a
    return text.split('\r\n').map((line, lineIndex) => {
        return (
            <React.Fragment key={lineIndex}>
                {line.split(linkRegex).map((part, index) => {
                    if (index % 2 === 1) {
                        return <a key={index} href={part} target="_blank" rel="noopener noreferrer">{part}</a>;
                    } else {
                        return part;
                    }
                })}
            </React.Fragment>
        );
    });
};