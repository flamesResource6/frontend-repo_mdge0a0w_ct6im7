import { Link } from 'react-router-dom'

export default function AuctionCard({ auction }) {
  const statusColor = auction.status === 'live' ? 'bg-green-100 text-green-700' : auction.status === 'ended' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      {auction.image_url && (
        <img src={auction.image_url} alt={auction.title} className="h-48 w-full object-cover" />
      )}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className={`text-xs px-2 py-1 rounded-full ${statusColor}`}>{auction.status.toUpperCase()}</span>
          <span className="text-sm text-gray-500">{auction.tags?.slice(0,3).join(' • ')}</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{auction.title}</h3>
        {auction.description && (
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{auction.description}</p>
        )}
        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">Current Price</p>
            <p className="text-xl font-bold">${(auction.current_price ?? auction.starting_price).toFixed(2)}</p>
          </div>
          <Link
            to={`/auction/${auction.id}`}
            className="inline-flex items-center px-3 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  )
}
