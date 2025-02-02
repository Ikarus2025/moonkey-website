import dynamic from 'next/dynamic';

const SafeHome = dynamic(() => import('./indexSafe'), { ssr: false });

export default SafeHome;

