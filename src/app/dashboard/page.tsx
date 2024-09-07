import ProtectedRoute from '../../components/ProtectedRoute'; // Import the HOC

const DashboardPage = () => {
  return (
    <ProtectedRoute>
      <div className="relative min-h-screen flex items-center justify-center bg-shadow-black text-ice-blue">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Welcome to Your Dashboard</h1>
          <p className="text-lg mt-4">This is your dashboard where you can access your game information.</p>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default DashboardPage;

  