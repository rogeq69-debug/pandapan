import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { products, categories, getByCategory } from '@/lib/products'
import ProductCard from '@/components/ProductCard'

export default function CatalogSection() {
  return (
    <section
      id="catalogo"
      className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8"
    >
      {/* Encabezado */}
      <div className="mb-8 text-center">
        <h2
          className="mb-2 text-3xl font-bold text-foreground sm:text-4xl"
          style={{ fontFamily: 'var(--font-playfair, serif)' }}
        >
          Nuestros Productos
        </h2>
        <p className="text-muted-foreground">
          {products.length} variedades horneadas con amor cada día
        </p>
      </div>

      {/* Tabs de categorías */}
      <Tabs defaultValue="Panes">
        <TabsList className="mb-6 h-auto w-full justify-start gap-1 rounded-full bg-muted p-1">
          {categories.map((cat) => (
            <TabsTrigger
              key={cat}
              value={cat}
              className="flex-1 rounded-full px-4 py-2 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              {cat}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((cat) => {
          const items = getByCategory(cat)
          return (
            <TabsContent key={cat} value={cat}>
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border py-20 text-center">
                  <span className="text-4xl">🥐</span>
                  <p className="mt-3 text-lg font-semibold text-muted-foreground">
                    Próximamente
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Estamos preparando algo delicioso para esta categoría.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </TabsContent>
          )
        })}
      </Tabs>
    </section>
  )
}
