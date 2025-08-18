import React, { useState } from "react";
import { TrendingUp, CheckCircle, Star, Building2 } from "lucide-react";

const creatorPlans = [
  {
    name: "Basic",
    priceMonthly: "₹49",
    priceYearly: "₹529",
    period: "month",
    description:
      "Great for individual content creators just starting their journey with essential tools and limited access.",
    features: [
      "5 Projects",
      "10GB Storage",
      "Email Support",
      "Basic Templates",
      "Mobile App Access",
      "Community Access",
      "Limited API Usage",
    ],
    buttonText: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    priceMonthly: "₹99",
    priceYearly: "₹1069",
    period: "month",
    description:
      "Designed for professional creators looking to scale with enhanced capabilities and audience engagement tools.",
    features: [
      "50 Projects",
      "100GB Storage",
      "Priority Support",
      "Premium Templates",
      "Advanced Analytics",
      "Team Collaboration",
      "Custom Branding",
      "Unlimited Revisions",
      "Workflow Automation",
    ],
    buttonText: "✓ Choose Pro",
    popular: true,
  },
  {
    name: "Enterprise",
    priceMonthly: "₹199",
    priceYearly: "₹2149",
    period: "month",
    description:
      "Tailored for content agencies or influencer networks requiring full control, priority support, and advanced distribution.",
    features: [
      "Unlimited Projects",
      "1TB Storage",
      "24/7 Phone Support",
      "Custom Templates",
      "Advanced Security",
      "API Access",
      "Dedicated Manager",
      "Custom Integrations",
      "SLA Uptime Guarantee",
      "Tailored Onboarding",
      "Enterprise Reporting",
    ],
    buttonText: "Contact Sales",
    popular: false,
  },
];

const brandPlans = [
  {
    name: "Brand Starter",
    priceMonthly: "₹149",
    priceYearly: "₹1609",
    period: "month",
    description:
      "Ideal for startups and small brands establishing a presence with key engagement features.",
    features: [
      "10 Campaigns",
      "200GB Storage",
      "Email & Chat Support",
      "Brand Templates",
      "Analytics Dashboard",
      "Basic API Access",
      "Collaboration Tools",
    ],
    buttonText: "Get Started",
    popular: false,
  },
  {
    name: "Brand Pro",
    priceMonthly: "₹299",
    priceYearly: "₹3229",
    period: "month",
    description:
      "Perfect for growing brands with automation tools and custom branding capabilities.",
    features: [
      "100 Campaigns",
      "2TB Storage",
      "Priority Support",
      "Custom Brand Templates",
      "Advanced Analytics",
      "Full API Access",
      "Team Access",
      "Workflow Automation",
      "Brand Protection Tools",
    ],
    buttonText: "✓ Choose Pro",
    popular: true,
  },
  {
    name: "Brand Enterprise",
    priceMonthly: "₹499",
    priceYearly: "₹5389",
    period: "month",
    description:
      "For large brands and agencies managing massive reach, custom integrations, and premium support.",
    features: [
      "Unlimited Campaigns",
      "10TB Storage",
      "Dedicated Support Team",
      "Custom Templates & Integrations",
      "Real-Time Analytics",
      "Multi-Brand Management",
      "24/7 Support",
      "SLA Uptime Guarantee",
      "Dedicated Success Manager",
      "White-label Options",
    ],
    buttonText: "Contact Sales",
    popular: false,
  },
];

function PlanCard({ plan, isYearly }) {
  return (
    <div
      className={`relative w-full md:w-1/3 max-w-sm flex flex-col gap-6 px-8 py-10 rounded-xl shadow-lg border border-gray-800 transition-all duration-300 ${
        plan.popular 
          ? "bg-gray-950" 
          : "bg-gray-950"
      }`}
    >
      {plan.popular && (
        <div className="absolute top-0 right-0 bg-white text-black text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-xl">
          Most Popular
        </div>
      )}

      <div className="flex items-start gap-3">
        {plan.name.toLowerCase().includes("basic") && (
          <CheckCircle className="text-gray-400 w-6 h-6 flex-shrink-0 mt-1" />
        )}
        {plan.name.toLowerCase().includes("pro") && (
          <Star className="text-yellow-400 w-6 h-6 flex-shrink-0 mt-1" />
        )}
        {plan.name.toLowerCase().includes("enterprise") && (
          <Building2 className="text-purple-400 w-6 h-6 flex-shrink-0 mt-1" />
        )}
        {plan.name.toLowerCase().includes("starter") && (
          <CheckCircle className="text-gray-400 w-6 h-6 flex-shrink-0 mt-1" />
        )}
        <h2 className="text-2xl font-semibold text-white leading-tight">
          {plan.popular ? "Recommended - " : ""}
          {plan.name} Plan
        </h2>
      </div>

      <p className="text-4xl font-bold text-white">
        {isYearly ? plan.priceYearly : plan.priceMonthly}{" "}
        <span className="text-lg font-normal text-gray-400">
          / {isYearly ? "year" : plan.period}
        </span>
      </p>
      <p className="text-gray-400 text-base leading-relaxed">{plan.description}</p>

      <div className="border-t border-gray-800"></div>

      <ul className="grid grid-cols-1 gap-y-3 text-sm">
        {plan.features.map((feature, idx) => (
          <li key={idx} className="flex items-center gap-2 text-gray-300">
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
            {feature}
          </li>
        ))}
      </ul>

      <div className="border-t border-gray-800"></div>

      <button
        className={`mt-4 w-full px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
          plan.popular
            ? "bg-white text-black hover:bg-gray-200"
            : "border border-gray-600 text-white hover:bg-white hover:text-black"
        }`}
      >
        {plan.buttonText}
      </button>
    </div>
  );
}

function ComparisonTable({ plans, title }) {
  const allFeatures = [...new Set(plans.flatMap((plan) => plan.features))];

  return (
    <div className="mb-20">
      <h2 className="text-3xl font-bold mb-8 text-center text-white">{title} Comparison</h2>
      <div className="overflow-x-auto max-w-7xl mx-auto">
        <div className="bg-gray-950 border border-gray-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm text-left text-gray-300">
            <thead>
              <tr className="border-b border-gray-800 bg-black">
                <th className="py-4 px-6 font-semibold text-white">Feature</th>
                {plans.map((plan) => (
                  <th key={plan.name} className="py-4 px-6 text-center font-semibold text-white">
                    {plan.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allFeatures.map((feature, idx) => (
                <tr key={idx} className="border-b border-gray-800 hover:bg-gray-900/50 transition-colors">
                  <td className="py-4 px-6 text-gray-300">{feature}</td>
                  {plans.map((plan) => (
                    <td key={plan.name} className="py-4 px-6 text-center">
                      {plan.features.includes(feature) ? (
                        <CheckCircle className="w-5 h-5 text-green-400 mx-auto" />
                      ) : (
                        <span className="text-gray-600">—</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Pro() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white px-6 py-12">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <TrendingUp className="w-8 h-8 text-white" />
          <h1 className="text-4xl font-bold text-white">Upgrade to Pro</h1>
        </div>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Unlock premium features and elevate your experience with our tailored plans for creators and brands.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <button
            className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${
              !isYearly 
                ? "bg-white text-black" 
                : "bg-gray-950 border border-gray-800 text-white hover:border-gray-700 hover:bg-gray-900"
            }`}
            onClick={() => setIsYearly(false)}
          >
            Monthly
          </button>
          <button
            className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${
              isYearly 
                ? "bg-white text-black" 
                : "bg-gray-950 border border-gray-800 text-white hover:border-gray-700 hover:bg-gray-900"
            }`}
            onClick={() => setIsYearly(true)}
          >
            Yearly (Save ~10%)
          </button>
        </div>
      </div>

      <div className="mb-20">
        <h2 className="text-3xl font-bold mb-8 text-center text-white">For Creators</h2>
        <div className="flex flex-col md:flex-row justify-center gap-8 max-w-7xl mx-auto">
          {creatorPlans.map((plan, index) => (
            <PlanCard key={index} plan={plan} isYearly={isYearly} />
          ))}
        </div>
      </div>

      <ComparisonTable plans={creatorPlans} title="Creator Plans" />

      <div className="mb-20">
        <h2 className="text-3xl font-bold mb-8 text-center text-white">For Brands</h2>
        <div className="flex flex-col md:flex-row justify-center gap-8 max-w-7xl mx-auto">
          {brandPlans.map((plan, index) => (
            <PlanCard key={index} plan={plan} isYearly={isYearly} />
          ))}
        </div>
      </div>

      <ComparisonTable plans={brandPlans} title="Brand Plans" />

      <div className="mt-12 text-center text-sm text-gray-400">
        🔒 Secure payments | Cancel anytime | No hidden charges
      </div>
    </div>
  );
}

export default Pro;