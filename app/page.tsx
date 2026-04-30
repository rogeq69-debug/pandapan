import Hero from '@/components/Hero'
import CatalogSection from '@/components/CatalogSection'
import CartSheet from '@/components/CartSheet'
import { getPrices } from '@/app/actions'

export default async function Home() {
  const prices = await getPrices()

  return (
    <main>
      <Hero />
      <CatalogSection prices={prices} />
      <CartSheet />
    </main>
  )
}
