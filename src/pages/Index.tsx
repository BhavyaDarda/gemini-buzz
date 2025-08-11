import { Dashboard } from "@/components/Dashboard";
import SEO from "@/components/SEO";

const Index = () => {
  return (
    <>
      <SEO
        title="AI Reddit Post Generator Dashboard"
        description="Generate viral Reddit posts with Gemini Pro, analyze trends, and optimize engagement."
        canonical="/"
      />
      <Dashboard />
    </>
  );
};

export default Index;
