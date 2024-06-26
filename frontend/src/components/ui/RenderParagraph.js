import { isURL } from '../../utils/utils.js'; 
import PropTypes from 'prop-types';

function renderParagraph(paragraph) {
    console.log(paragraph);
    const parts = paragraph.split('\n');
    return parts.map((part, index) => {
        if (isURL(part)) { // Kiểm tra xem phần này có phải là một URL hay không
            return <a key={index} href={part}>{part}</a>;
        } else {
            return <span key={index}>{part}</span>;
        }
    });
}

function RenderParagraph({ item }) {
    return (
        <div className="blog-content">
            <p className="blog-content-paragraph">
                {renderParagraph(item.paragraph)}
            </p>
        </div>
    );
}

RenderParagraph.propTypes = {
    item: PropTypes.shape({
        paragraph: PropTypes.string.isRequired
    }).isRequired
};

export default RenderParagraph;
