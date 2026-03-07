import { Switch, Route } from "wouter";
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import Home from "@/pages/Home";

// Lazy-loaded routes for code splitting
const About = lazy(() => import("@/pages/About"));
const Contact = lazy(() => import("@/pages/Contact"));
const ServicesPage = lazy(() => import("@/pages/ServicesPage"));
const ComplaintsBook = lazy(() => import("@/pages/ComplaintsBook"));
const Admin = lazy(() => import("@/pages/Admin"));
const NotFound = lazy(() => import("@/pages/not-found"));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-brand-primary text-xl font-semibold">
        <span translate="no">Setor Saúde</span>
      </div>
    </div>
  );
}

function App() {
  return (
    <>
      <Suspense fallback={<PageLoader />}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/sobre" component={About} />
          <Route path="/services" component={ServicesPage} />
          <Route path="/servicos" component={ServicesPage} />
          <Route path="/contact" component={Contact} />
          <Route path="/contactos" component={Contact} />
          <Route path="/complaints-book" component={ComplaintsBook} />
          <Route path="/livro-reclamacoes" component={ComplaintsBook} />
          <Route path="/admin" component={Admin} />
          <Route component={NotFound} />
        </Switch>
      </Suspense>
      <Toaster />
    </>
  );
}

export default App;
