import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer
} from 'recharts';
import { 
  Target,
  TrendingUp,
  Users,
  Layers,
  BarChart3,
  PieChart as PieIcon,
  Activity,
  Loader2,
  AlertCircle,
  ArrowLeft,
  Film,
  Brain
} from 'lucide-react';
import { analyticsAPI } from '../services/api';

const MetricCard = ({ title, value, subtitle, icon: Icon, color, trend }) => {
  return (
    <div className="card p-6 hover:shadow-glow transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <h3 className="font-medium text-txt-secondary text-sm">{title}</h3>
          <div className="text-3xl font-heading font-bold text-txt-primary">{value}</div>
          {subtitle && <p className="text-txt-muted text-sm">{subtitle}</p>}
        </div>
        
        <div className={`p-3 rounded-xl bg-${color} bg-opacity-20`}>
          <Icon className={`w-6 h-6 text-${color}`} />
        </div>
      </div>
      
      {trend && (
        <div className="mt-4 flex items-center gap-1">
          <TrendingUp className="w-4 h-4 text-accent-green" />
          <span className="text-sm text-accent-green">{trend}</span>
        </div>
      )}
    </div>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="card p-3 shadow-lg border border-bg-hover">
        <p className="text-txt-primary font-medium">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-txt-secondary text-sm">
            <span style={{ color: entry.color }}>{entry.name}: </span>
            {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const AnalyticsPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await analyticsAPI.getAnalytics();
        setAnalytics(response.data);
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setError(err.response?.data?.error || 'Failed to load analytics. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-accent-red mx-auto" />
          <div className="space-y-2">
            <h2 className="text-xl font-heading font-semibold text-txt-primary">
              Loading Analytics
            </h2>
            <p className="text-txt-secondary">
              Analyzing model performance and statistics...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="max-w-md mx-auto text-center space-y-6 p-6">
          <AlertCircle className="w-16 h-16 text-accent-red mx-auto" />
          <div className="space-y-2">
            <h2 className="text-xl font-heading font-semibold text-txt-primary">
              Analytics Unavailable
            </h2>
            <p className="text-txt-secondary">
              {error || 'Unable to load analytics data.'}
            </p>
          </div>
          <Link to="/" className="btn-primary">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const { model_performance, diversity, rating_distribution, genre_breakdown, user_activity } = analytics;

  // Prepare chart data
  const ratingChartData = rating_distribution ? Object.entries(rating_distribution).map(([rating, count]) => ({
    rating: `${rating} Stars`,
    count: count
  })) : [];

  const genreChartData = genre_breakdown ? Object.entries(genre_breakdown)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([genre, count]) => ({
      genre: genre.length > 15 ? genre.substring(0, 15) + '...' : genre,
      count: count
    })) : [];

  const userActivityData = user_activity ? Object.entries(user_activity).map(([range, count]) => ({
    range,
    users: count
  })) : [];

  const COLORS = ['#e50914', '#f5c518', '#46d369', '#2196f3', '#9c27b0', '#ff9800', '#795548', '#607d8b'];

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-txt-secondary hover:text-txt-primary transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-txt-primary flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-accent-red" />
              Analytics Dashboard
            </h1>
            <p className="text-txt-secondary text-lg">
              Real-time model performance metrics, diversity analysis, and system statistics
            </p>
          </div>
        </div>

        {/* Model Performance Metrics */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Brain className="w-6 h-6 text-accent-red" />
            <h2 className="text-2xl font-heading font-bold text-txt-primary">Model Performance</h2>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Precision@10"
              value={model_performance?.precision_at_10 ? (model_performance.precision_at_10 * 100).toFixed(1) + '%' : 'N/A'}
              subtitle="Accuracy of top 10 recommendations"
              icon={Target}
              color="accent-red"
            />
            
            <MetricCard
              title="Recall@10"
              value={model_performance?.recall_at_10 ? (model_performance.recall_at_10 * 100).toFixed(1) + '%' : 'N/A'}
              subtitle="Coverage of relevant items"
              icon={TrendingUp}
              color="accent-gold"
            />
            
            <MetricCard
              title="NDCG@10"
              value={model_performance?.ndcg_at_10 ? model_performance.ndcg_at_10.toFixed(3) : 'N/A'}
              subtitle="Ranking quality metric"
              icon={Layers}
              color="accent-green"
            />
            
            <MetricCard
              title="MAP"
              value={model_performance?.map ? model_performance.map.toFixed(3) : 'N/A'}
              subtitle="Mean Average Precision"
              icon={BarChart3}
              color="accent-blue"
            />
          </div>

          {/* Additional Performance Metrics */}
          {(model_performance?.rmse || model_performance?.mae) && (
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              {model_performance.rmse && (
                <MetricCard
                  title="RMSE"
                  value={model_performance.rmse.toFixed(3)}
                  subtitle="Root Mean Square Error"
                  icon={Activity}
                  color="accent-purple"
                />
              )}
              
              {model_performance.mae && (
                <MetricCard
                  title="MAE"
                  value={model_performance.mae.toFixed(3)}
                  subtitle="Mean Absolute Error"
                  icon={Activity}
                  color="accent-orange"
                />
              )}
            </div>
          )}
        </div>

        {/* Diversity Metrics */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Film className="w-6 h-6 text-accent-green" />
            <h2 className="text-2xl font-heading font-bold text-txt-primary">Diversity Analysis</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <MetricCard
              title="Catalog Coverage"
              value={diversity?.catalog_coverage ? (diversity.catalog_coverage * 100).toFixed(1) + '%' : 'N/A'}
              subtitle="Percentage of catalog recommended"
              icon={Film}
              color="accent-green"
            />
            
            <MetricCard
              title="Intra-List Diversity"
              value={diversity?.intra_list_diversity ? diversity.intra_list_diversity.toFixed(3) : 'N/A'}
              subtitle="Variety within recommendations"
              icon={Layers}
              color="accent-blue"
            />
            
            <MetricCard
              title="Popularity Balance"
              value={diversity?.popularity_hits ? (diversity.popularity_hits * 100).toFixed(0) + '%' : 'N/A'}
              subtitle="Mainstream vs niche content"
              icon={TrendingUp}
              color="accent-orange"
            />
          </div>
        </div>

        {/* Charts Section */}
        <div className="space-y-8">
          {/* Rating Distribution */}
          {ratingChartData.length > 0 && (
            <div className="card p-6">
              <h3 className="text-xl font-heading font-semibold text-txt-primary mb-6 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Rating Distribution
              </h3>
              
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ratingChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis 
                      dataKey="rating" 
                      stroke="#b3b3b3"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="#b3b3b3"
                      fontSize={12}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" fill="#e50914" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Genre Breakdown */}
            {genreChartData.length > 0 && (
              <div className="card p-6">
                <h3 className="text-xl font-heading font-semibold text-txt-primary mb-6 flex items-center gap-2">
                  <PieIcon className="w-5 h-5" />
                  Top Genres
                </h3>
                
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={genreChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ genre, percent }) => `${genre}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {genreChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* User Activity */}
            {userActivityData.length > 0 && (
              <div className="card p-6">
                <h3 className="text-xl font-heading font-semibold text-txt-primary mb-6 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  User Activity Distribution
                </h3>
                
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={userActivityData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis 
                        dataKey="range" 
                        stroke="#b3b3b3"
                        fontSize={12}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis 
                        stroke="#b3b3b3"
                        fontSize={12}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="users" fill="#f5c518" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* System Info */}
        <div className="mt-12">
          <div className="card p-6">
            <h3 className="text-xl font-heading font-semibold text-txt-primary mb-4">System Information</h3>
            
            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div className="space-y-2">
                <h4 className="font-medium text-txt-primary">Dataset</h4>
                <ul className="text-txt-secondary space-y-1">
                  <li>• MovieLens ml-latest-small</li>
                  <li>• 100,836 ratings</li>
                  <li>• 9,742 movies</li>
                  <li>• 610 users</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-txt-primary">Model Architecture</h4>
                <ul className="text-txt-secondary space-y-1">
                  <li>• Hybrid Recommender</li>
                  <li>• SVD Collaborative Filtering</li>
                  <li>• TF-IDF Content-Based</li>
                  <li>• MMR Diversity Optimization</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-txt-primary">Training Details</h4>
                <ul className="text-txt-secondary space-y-1">
                  <li>• 50 latent factors</li>
                  <li>• 20 epochs SGD</li>
                  <li>• 80/20 time-based split</li>
                  <li>• Real-time evaluation</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;