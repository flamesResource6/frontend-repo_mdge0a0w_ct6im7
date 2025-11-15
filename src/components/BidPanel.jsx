import { useState } from 'react'

export default function BidPanel({ auction, onBidPlaced }) {
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const placeBid = async (e) => {
    e.preventDefault()
    setError('')
    const numeric = parseFloat(amount)
    if (!name || isNaN(numeric)) {
      setError('Enter your name and a valid amount')
      return
    }
    const min = auction.current_price ?? auction.starting_price
    if (numeric <= min) {
      setError(`Bid must be higher than $${min.toFixed(2)}`)
      return
    }
    try {
      setLoading(true)
      const res = await fetch(`${baseUrl}/auctions/${auction.id}/bids`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bidder_name: name, amount: numeric })
      })
      if (!res.ok) {
        const j = await res.json().catch(()=>({detail:'Failed to place bid'}))
        throw new Error(j.detail || 'Bid failed')
      }
      const data = await res.json()
      onBidPlaced(data.current_price)
      setAmount('')
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={placeBid} className="mt-4 p-4 bg-gray-50 rounded-lg">
      <div className="flex gap-2">
        <input
          className="flex-1 border rounded-lg px-3 py-2"
          placeholder="Your name"
          value={name}
          onChange={e=>setName(e.target.value)}
        />
        <input
          className="w-40 border rounded-lg px-3 py-2"
          placeholder={`>$${(auction.current_price ?? auction.starting_price).toFixed(2)}`}
          value={amount}
          onChange={e=>setAmount(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? 'Bidding...' : 'Place Bid'}
        </button>
      </div>
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
    </form>
  )
}
