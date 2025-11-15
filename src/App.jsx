import { useEffect, useState } from 'react'
import { Link, Routes, Route, useParams, useNavigate } from 'react-router-dom'
import AuctionCard from './components/AuctionCard'
import BidPanel from './components/BidPanel'

const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function Home() {
  const [auctions, setAuctions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${baseUrl}/auctions`)
        const data = await res.json()
        setAuctions(data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <header className="sticky top-0 z-10 backdrop-blur bg-white/70 border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold">Live Sports Auction</Link>
          <nav className="flex items-center gap-4 text-sm">
            <a href="/test" className="text-gray-600 hover:text-gray-900">System Test</a>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Live Auctions</h1>
        {loading ? (
          <p className="text-gray-600">Loading auctions...</p>
        ) : auctions.length === 0 ? (
          <div className="text-center p-12 bg-white rounded-xl border">
            <p className="text-gray-600">No auctions yet. Create one below to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {auctions.map(a => <AuctionCard key={a.id} auction={a} />)}
          </div>
        )}
        <CreateAuctionForm onCreated={(a)=>setAuctions([a, ...auctions])} />
      </main>
    </div>
  )
}

function CreateAuctionForm({ onCreated }) {
  const [title, setTitle] = useState('Signed Jersey - Charity Lot')
  const [price, setPrice] = useState(50)
  const [durationMins, setDurationMins] = useState(30)
  const [image, setImage] = useState('https://images.unsplash.com/photo-1521417531735-1fdf5f3d9f82?q=80&w=1200&auto=format&fit=crop')
  const [creating, setCreating] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setCreating(true)
    try {
      const start = new Date()
      const end = new Date(Date.now() + durationMins * 60 * 1000)
      const res = await fetch(`${baseUrl}/auctions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description: 'Official team merchandise',
          image_url: image,
          starting_price: Number(price),
          start_time: start.toISOString(),
          end_time: end.toISOString(),
          tags: ['sports','memorabilia']
        })
      })
      const data = await res.json()
      if (res.ok) {
        const newAuction = await (await fetch(`${baseUrl}/auctions/${data.id}`)).json()
        onCreated(newAuction)
      }
    } finally {
      setCreating(false)
    }
  }

  return (
    <form onSubmit={submit} className="mt-10 p-6 bg-white rounded-xl border space-y-4">
      <h2 className="text-xl font-semibold">Create a Live Auction</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Title</label>
          <input className="w-full border rounded-lg px-3 py-2" value={title} onChange={e=>setTitle(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Starting Price ($)</label>
          <input type="number" className="w-full border rounded-lg px-3 py-2" value={price} onChange={e=>setPrice(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Duration (minutes)</label>
          <input type="number" className="w-full border rounded-lg px-3 py-2" value={durationMins} onChange={e=>setDurationMins(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Image URL</label>
          <input className="w-full border rounded-lg px-3 py-2" value={image} onChange={e=>setImage(e.target.value)} />
        </div>
      </div>
      <button disabled={creating} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-60">{creating ? 'Creating...' : 'Create Auction'}</button>
    </form>
  )
}

function AuctionDetail() {
  const { id } = useParams()
  const [auction, setAuction] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`${baseUrl}/auctions/${id}`)
      if (!res.ok) {
        navigate('/')
        return
      }
      const data = await res.json()
      setAuction(data)
      setLoading(false)
    }
    load()
  }, [id])

  const onBidPlaced = (newPrice) => {
    setAuction(a => ({...a, current_price: newPrice}))
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <header className="sticky top-0 z-10 backdrop-blur bg-white/70 border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold">Live Sports Auction</Link>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl border overflow-hidden">
          {auction.image_url && <img src={auction.image_url} alt={auction.title} className="w-full h-80 object-cover" />}
          <div className="p-6">
            <h1 className="text-3xl font-bold">{auction.title}</h1>
            <p className="text-gray-600 mt-2">{auction.description}</p>
            <div className="mt-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Current Price</p>
                <p className="text-3xl font-bold">${(auction.current_price ?? auction.starting_price).toFixed(2)}</p>
              </div>
              <div className="text-sm text-gray-600">
                <p>Ends: {new Date(auction.end_time).toLocaleString()}</p>
              </div>
            </div>
            <BidPanel auction={{...auction, id}} onBidPlaced={onBidPlaced} />
            {auction.top_bids && auction.top_bids.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold mb-2">Top Bids</h3>
                <ul className="space-y-1">
                  {auction.top_bids.map(b => (
                    <li key={b.id} className="flex justify-between text-sm">
                      <span className="text-gray-700">{b.bidder_name}</span>
                      <span className="font-mono">${b.amount.toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

function RouterApp() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auction/:id" element={<AuctionDetail />} />
    </Routes>
  )
}

export default RouterApp
