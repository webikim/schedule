import Head from 'next/head';
import styles from '../styles/Home.module.css';

export async function getStaticProps() {
    return {
        props: {
            heading: 'Build your own reservation page.',
            details: '*** Landing page needs to be designed. ***',
        },
    };
}

interface Props {
    heading: string;
    details: string;
}

export default function Home({ heading, details }: Props) {
    return (
        <div className={styles.container}>
            <Head>
                <title id="title">{heading}</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main>
                <h1 id="heading">{heading}</h1>

                <h3>Please Sign In to check out</h3>
                <span className="details">{details}</span>
            </main>
        </div>
    );
}
