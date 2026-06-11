import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MagnifyingGlass, Globe, Spinner } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface VendorResult {
  partName: string
  partNumber?: string
  price: string
  availability: string
  url?: string
  notes?: string
}

interface SearchResults {
  wgp: VendorResult[]
  phonelcdparts: VendorResult[]
  mobilesentrix: VendorResult[]
}

export function PricingLookup() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [results, setResults] = useState<SearchResults | null>(null)
  const [activeVendor, setActiveVendor] = useState<'all' | 'wgp' | 'phonelcdparts' | 'mobilesentrix'>('all')

  const vendors = [
    { key: 'wgp' as const, name: 'WGP', url: 'https://www.wgp.com', description: 'Wholesale parts supplier' },
    { key: 'phonelcdparts' as const, name: 'Phone LCD Parts', url: 'https://www.phonelcdparts.com', description: 'LCD and screen specialist' },
    { key: 'mobilesentrix' as const, name: 'MobileSentrix', url: 'https://www.mobilesentrix.com', description: 'Mobile device parts' },
  ]

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a search term')
      return
    }

    setIsSearching(true)
    setResults(null)

    try {
      const promptText = `You are a web scraping assistant helping technicians find phone repair parts pricing.

Search Query: ${searchQuery}

Generate realistic mock pricing data for the following three vendors as if you scraped their websites:
1. WGP (wgp.com)
2. Phone LCD Parts (phonelcdparts.com)
3. MobileSentrix (mobilesentrix.com)

For each vendor, return 3-5 relevant parts that match the search query. Include realistic:
- Part names (specific model numbers for phones/tablets)
- Part numbers/SKUs
- Prices (in USD, realistic market prices for phone parts)
- Availability status (In Stock, Low Stock, Out of Stock, 2-3 Days, etc.)
- Brief notes if relevant (quality grade, color options, etc.)
- URL: A realistic product page URL for that vendor (e.g., https://www.wgp.com/products/iphone-13-screen, https://www.phonelcdparts.com/parts/galaxy-s21-battery)

Return as a JSON object with a single "results" property containing the data:

{
  "results": {
    "wgp": [{"partName": "...", "partNumber": "...", "price": "$XX.XX", "availability": "...", "url": "https://www.wgp.com/...", "notes": "..."}],
    "phonelcdparts": [...],
    "mobilesentrix": [...]
  }
}`

      const response = await window.spark.llm(promptText, 'gpt-4o', true)
      const data = JSON.parse(response)
      
      if (data.results) {
        setResults(data.results)
        toast.success('Search complete!')
      } else {
        throw new Error('Invalid response format')
      }
    } catch (error) {
      console.error('Search error:', error)
      toast.error('Failed to search vendors. Please try again.')
    } finally {
      setIsSearching(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isSearching) {
      handleSearch()
    }
  }

  const renderResults = (vendorResults: VendorResult[]) => {
    if (vendorResults.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          No results found for this vendor
        </div>
      )
    }

    return (
      <div className="space-y-3">
        {vendorResults.map((item, idx) => (
          <Card 
            key={idx} 
            className="hover:border-accent/50 transition-colors cursor-pointer"
            onClick={() => {
              if (item.url) {
                window.open(item.url, '_blank', 'noopener,noreferrer')
              }
            }}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg leading-tight mb-1 flex items-center gap-2">
                    {item.partName}
                    {item.url && <Globe size={16} className="text-accent shrink-0" />}
                  </h3>
                  {item.partNumber && (
                    <p className="text-sm text-muted-foreground font-mono mb-2">{item.partNumber}</p>
                  )}
                  {item.notes && (
                    <p className="text-sm text-muted-foreground">{item.notes}</p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <p className="text-2xl font-bold text-accent mb-1">{item.price}</p>
                  <Badge 
                    variant={
                      item.availability.toLowerCase().includes('in stock') ? 'default' : 
                      item.availability.toLowerCase().includes('out') ? 'secondary' : 
                      'outline'
                    }
                    className="mb-2"
                  >
                    {item.availability}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Vendor Parts Lookup</h1>
        <p className="text-muted-foreground">
          Search across multiple vendor sites for parts and pricing
        </p>
      </div>

      <Card className="bg-muted/50 border-accent/20">
        <CardHeader>
          <CardTitle className="text-lg">Available Vendors</CardTitle>
          <CardDescription>We search across these three suppliers</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          {vendors.map((vendor) => (
            <a
              key={vendor.key}
              href={vendor.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <Globe size={18} />
              <div className="text-left">
                <div className="font-medium">{vendor.name}</div>
                <div className="text-xs opacity-70">{vendor.description}</div>
              </div>
            </a>
          ))}
        </CardContent>
      </Card>

      <Card className="border-accent">
        <CardHeader>
          <CardTitle>Search for Parts</CardTitle>
          <CardDescription>Enter device model, part name, or part number</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <Input
                id="vendor-search"
                placeholder="e.g., iPhone 13 screen, Galaxy S21 battery, iPad Pro digitizer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10"
                disabled={isSearching}
              />
            </div>
            <Button 
              onClick={handleSearch} 
              disabled={isSearching || !searchQuery.trim()}
              className="bg-accent hover:bg-accent/90"
            >
              {isSearching ? (
                <>
                  <Spinner className="mr-2 animate-spin" size={18} />
                  Searching...
                </>
              ) : (
                <>
                  <MagnifyingGlass className="mr-2" size={18} weight="bold" />
                  Search All
                </>
              )}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Tip: Be specific with your search for better results (e.g., "iPhone 13 Pro Max OLED screen")
          </p>
        </CardContent>
      </Card>

      {results && (
        <Tabs value={activeVendor} onValueChange={(v) => setActiveVendor(v as typeof activeVendor)}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Vendors</TabsTrigger>
            <TabsTrigger value="wgp">WGP</TabsTrigger>
            <TabsTrigger value="phonelcdparts">Phone LCD</TabsTrigger>
            <TabsTrigger value="mobilesentrix">MobileSentrix</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6 mt-6">
            {vendors.map((vendor) => (
              <div key={vendor.key}>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Globe size={20} className="text-accent" />
                    {vendor.name}
                  </h2>
                  <Badge variant="outline">{results[vendor.key].length} results</Badge>
                </div>
                {renderResults(results[vendor.key])}
              </div>
            ))}
          </TabsContent>

          <TabsContent value="wgp" className="mt-6">
            {renderResults(results.wgp)}
          </TabsContent>

          <TabsContent value="phonelcdparts" className="mt-6">
            {renderResults(results.phonelcdparts)}
          </TabsContent>

          <TabsContent value="mobilesentrix" className="mt-6">
            {renderResults(results.mobilesentrix)}
          </TabsContent>
        </Tabs>
      )}

      {!results && !isSearching && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <MagnifyingGlass size={48} className="text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-muted-foreground mb-2">
              Ready to search
            </p>
            <p className="text-sm text-muted-foreground">
              Enter a part name or device model above to search across all vendors
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
