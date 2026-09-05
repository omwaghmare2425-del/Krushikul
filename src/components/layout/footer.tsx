import { Leaf } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t mt-auto bg-card">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between md:flex-row gap-6">
          <div className="flex items-center space-x-2">
            <Leaf className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">KrushiKul</span>
          </div>
          <div className="text-center text-sm text-muted-foreground md:text-left">
            <p>&copy; {new Date().getFullYear()} KrushiKul. All rights reserved.</p>
            <p>Made with ❤️ for Indian Farmers.</p>
          </div>
          <div className="flex space-x-4">
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Privacy Policy</Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
