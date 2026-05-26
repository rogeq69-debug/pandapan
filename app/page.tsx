import Hero from '@/components/Hero'
import CatalogSection from '@/components/CatalogSection'
import CartSheet from '@/components/CartSheet'
import { getPrices, getUnits } from '@/app/actions'

export default async function Home() {
  const [prices, units] = await Promise.all([getPrices(), getUnits()])

  return (
    <main>
      <Hero />
      <CatalogSection prices={prices} units={units} />
      <CartSheet />
    </main>
  )
}
