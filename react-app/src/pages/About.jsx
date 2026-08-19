import { useNavigate } from 'react-router-dom';
import { COMPANY, TRUST_STATS } from '../data/catalogue';

function initials(name) {
  return name.split(/\s+/).slice(0, 2).map((w) => w.charAt(0)).join('');
}

function Face({ name, img, cls }) {
  if (!img) {
    return <div className={`${cls} ${cls}--initials`}>{initials(name)}</div>;
  }
  return (
    <div className={cls}>
      <img src={img} alt={name} loading="lazy" />
    </div>
  );
}

export default function About() {
  const navigate = useNavigate();
  const c = COMPANY;

  return (
    <>
      <div className="crumbs">
        <button onClick={() => navigate('/')}>Browse</button>
        <span>/</span>
        <span className="crumbs__here">About us</span>
      </div>

      <div className="about__intro">
        <div>
          <span className="panel__eyebrow">Since an 81 square foot stall</span>
          <h1 className="about__title">{c.storyTitle}</h1>
          {c.story.map((p) => (
            <p className="about__para" key={p.slice(0, 24)}>{p}</p>
          ))}
          <blockquote className="about__quote">
            {c.quote}
            <cite>{c.quoteBy}</cite>
          </blockquote>
        </div>
        <div className="about__shot">
          <img src={c.gallery[0][0]} alt={c.gallery[0][1]} />
          <div className="about__caption">{c.gallery[0][1]}</div>
        </div>
      </div>

      <div className="stats">
        {TRUST_STATS.map(([figure, label]) => (
          <div className="stats__cell" key={label}>
            <div className="stats__figure">{figure}</div>
            <div className="stats__label">{label}</div>
          </div>
        ))}
      </div>

      <div className="about__block">
        <span className="panel__eyebrow">What we stand for</span>
        <h2 className="about__h2">Six things we do not bend on</h2>
        <div className="values">
          {c.values.map(([name, text]) => (
            <div className="value" key={name}>
              <div className="value__name">{name}</div>
              <p className="value__text">{text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="about__block about__block--tint">
        <span className="panel__eyebrow">The people behind it</span>
        <h2 className="about__h2">Meet the team</h2>

        <div className="leaders">
          {c.leaders.map((l) => (
            <div className="leader" key={l.name}>
              <Face name={l.name} img={l.img} cls="leader__pic" />
              <div className="leader__body">
                <div className="leader__role">{l.role}</div>
                <div className="leader__name">{l.name}</div>
                <p className="leader__bio">{l.bio}</p>
                {l.note ? <div className="leader__note">{l.note}</div> : null}
              </div>
            </div>
          ))}
        </div>

        <div className="team">
          {c.team.map(([name, role, img]) => (
            <div className="member" key={name}>
              <Face name={name} img={img} cls="member__pic" />
              <div className="member__name">{name}</div>
              <div className="member__role">{role}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="about__block">
        <span className="panel__eyebrow">Press and media</span>
        <h2 className="about__h2">{c.press.title}</h2>
        <div className="press">
          <div className="press__shot">
            <img src={c.press.img} alt={c.press.title} loading="lazy" />
          </div>
          <p className="press__text">{c.press.text}</p>
        </div>
      </div>

      <div className="about__block about__block--tint">
        <span className="panel__eyebrow">At Panipokhari</span>
        <h2 className="about__h2">Around the showroom</h2>
        <div className="gallery">
          {c.gallery.map(([src, caption]) => (
            <figure className="shot" key={src}>
              <img src={src} alt={caption} loading="lazy" />
              <figcaption>{caption}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </>
  );
}
