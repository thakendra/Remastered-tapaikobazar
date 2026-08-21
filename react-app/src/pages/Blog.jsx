import { Link } from 'react-router-dom';
import { BLOG_POSTS } from '../data/blog';
import useReveal from '../lib/useReveal';
import { longDate } from '../lib/format';

export default function Blog() {
  useReveal([BLOG_POSTS.length]);

  return (
    <>
      <div className="crumbs">
        <Link to="/">Browse</Link>
        <span>/</span>
        <span className="crumbs__here">Journal</span>
      </div>

      <div className="sechead">
        <div data-reveal="fade">
          <div className="sechead__index">From the counter</div>
          <h1 className="sechead__title">Journal</h1>
          <p className="sechead__note">
            What we get asked at Panipokhari, written down. Running costs, choosing
            between sizes, and getting a finance file through first time.
          </p>
        </div>
      </div>

      <div className="grid-wrap">
        <div className="postgrid">
          {BLOG_POSTS.map((post, i) => (
            <Link
              className="post"
              key={post.slug}
              to={`/journal/${post.slug}`}
              data-reveal
              style={{ '--d': `${Math.min(i, 7) * 60}ms` }}
            >
              <div className="post__meta">
                <time dateTime={post.date}>{longDate(post.date)}</time>
                <span>{post.readMinutes} min read</span>
              </div>
              <h2 className="post__title">{post.title}</h2>
              <p className="post__excerpt">{post.excerpt}</p>
              <span className="post__cue">Read it</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
