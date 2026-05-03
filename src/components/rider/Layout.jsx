import RiderSidebar from './Sidebar';

export default function RiderLayout({ children }) {
    return (
        <div style={{
            display: 'flex',
            minHeight: '100vh',
            backgroundColor: '#F8FAFC',
        }}>
            <RiderSidebar />
            <div style={{
                marginLeft: '260px',
                flex: 1,
            }}>
                {children}
            </div>
        </div>
    );
}
