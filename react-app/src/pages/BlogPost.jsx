import { Link, useParams } from 'react-router-dom';
import { BLOG_POSTS } from '../data/blog';
import { CONTACT } from '../data/catalogue';
import useReveal from '../lib/useReveal';
import { longDate } from '../lib/format';

export default function BlogPost() {
  const { slug } = useParams();
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  useReveal([slug]);

  if (!post) {
    return (
      <div className="grid-wrap">
        <div className="empty">
          <div className="empty__title">No such entry</div>
          <p className="empty__note">
            <Link to="/journal">Back to the journal</Link>
          </p>
        </div>
      </div>
    );
  }

  const others = BLOG_POSTS.filter((p) => p.slug !== slug).slice(0, 2);

  return (
    <>
      <div className="crumbs">
        <Link to="/">Browse</Link>
        <span>/</span>
        <Link to="/journal">Journal</Link>
        <span>/</span>
        <span className="crumbs__here">{post.title}</span>
      </div>

      <article className="article">
        <header className="article__head" data-reveal="fade">
          <div className="article__meta">
            <time dateTime={post.date}>{longDate(post.date)}</time>
            <span>{post.readMinutes} min read</span>
          </div>
          <h1 className="article__title">{post.title}</h1>
          <p className="article__standfirst">{post.excerpt}</p>
        </header>

        <div className="article__body">
          {post.body.map((block, i) =>
            block.h ? (
              <h2 className="article__h2" key={i} data-reveal="fade">
                {block.h}
              </h2>
            ) : (
              <p key={i} data-reveal="fade">
                {block.p}
              </p>
            )
          )}
        </div>

        <aside className="article__ask" data-reveal>
          <p className="article__ask-title">Rather just ask someone?</p>
          <p className="article__ask-note">
            The counter at Panipokhari answers this sort of thing all day. {CONTACT.hours}.
          </p>
          <div className="article__ask-actions">
            <a
              className="btn btn--red"
              href={`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(
                `I read "${post.title}" and have a question.`
              )}`}
              target="_blank"
              rel="noopener"
            >
              Ask on WhatsApp
            </a>
            <a className="btn btn--outline-navy" href={`tel:${CONTACT.mobiles[0]}`}>
              Call {CONTACT.mobiles[0]}
            </a>
          </div>
        </aside>
      </article>

      {others.length ? (
        <div className="grid-wrap">
          <div className="detail__block-label">More from the journal</div>
          <div className="postgrid postgrid--tight">
            {others.map((p, i) => (
              <Link
                className="post"
                key={p.slug}
                to={`/journal/${p.slug}`}
                data-reveal
                style={{ '--d': `${i * 60}ms` }}
              >
                <div className="post__meta">
                  <time dateTime={p.date}>{longDate(p.date)}</time>
                  <span>{p.readMinutes} min read</span>
                </div>
                <h2 className="post__title">{p.title}</h2>
                <span className="post__cue">Read it</span>
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </>
  );
}
