"use client";

import { useEffect, useState } from "react";
import {
  Heart,
  Users,
  Gift,
  HandCoins,
  CircleDollarSign,
  IndianRupee,
  LayoutDashboard,
  Check,
  ArrowUp,
  Star,
  Phone,
  Mail,
  Lock,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function DonatePage({ searchParams }) {
  const { projectId, type, amount, frequency } = searchParams;
  const { isSignedIn, user } = useUser();
  const router = useRouter();

  const [isRazorpayReady, setIsRazorpayReady] = useState(false);

  const [isRecurring, setIsRecurring] = useState(
    frequency != "One-Time" ? true : false
  );
  const [donationFrequency, setDonationFrequency] = useState(
    frequency ?? "One-Time"
  );
  const [requestCertificate, setRequestCertificate] = useState(false);
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(projectId);
  const [customAmount, setCustomAmount] = useState(amount ?? 50);
  const [donationType, setDonationType] = useState(type ?? "Zakat");
  const [showRecurringConfirm, setShowRecurringConfirm] = useState(false);
  const [oneTimeCountdown, setOneTimeCountdown] = useState(0);
  const quickAmounts = [1000, 2500, 5000, 10000, 15000, 25000];
  const impact = isRecurring
    ? (() => {
      const daily =
        donationFrequency === "Daily"
          ? customAmount
          : donationFrequency === "Weekly"
            ? customAmount / 7
            : donationFrequency === "Monthly"
              ? customAmount / 30
              : customAmount / 365;
      return {
        Daily: daily.toFixed(0),
        Weekly: (daily * 7).toFixed(0),
        Monthly: (daily * 30).toFixed(0),
        Yearly: (daily * 365).toFixed(0),
      };
    })()
    : {};
  const [donationFor, setDonationFor] = useState("self");
  const [dedicatedTo, setDedicatedTo] = useState("");
  const [message, setMessage] = useState("");
  const minAmounts = {
    "One-Time": 50,
    Daily: 5,
    Weekly: 20,
    Monthly: 50,
    Yearly: 365,
  };
  const minAmount =
    !isRecurring || donationFrequency === "One-Time"
      ? minAmounts["One-Time"]
      : minAmounts[donationFrequency] || 50;
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [userEmail, setUserEmail] = useState(
    user?.emailAddresses?.[0]?.emailAddress || ""
  );

  const name = `${firstName} ${lastName}`.trim() || "Anonymous";
  const email = userEmail || "anonymous@example.com";

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setUserEmail(user.emailAddresses?.[0]?.emailAddress || "");
    }
  }, [user]);
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects?status=Active`, {
      next: { revalidate: 3600 },
    })
      .then((res) => res.json())
      .then((data) => {
        setProjects(data.projects || []);

        if (!data.projects?.some((p) => p._id === projectId)) {
          setSelectedProjectId(data.projects?.[0]?._id || "");
        }
      })
      .catch((err) => console.error("Failed to fetch projects:", err));
  }, [projectId]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    script.onload = () => setIsRazorpayReady(true);
    script.onerror = () => console.error("Razorpay SDK failed to load");

    document.body.appendChild(script);

    // remove script on unmount
    return () => script.remove();
  }, []);

  useEffect(() => {
    if (!customAmount || customAmount < minAmount) {
      setCustomAmount(minAmount);
    }
  }, [minAmount]);

  useEffect(() => {
    if (!showRecurringConfirm) {
      setOneTimeCountdown(0);
      return;
    }

    setOneTimeCountdown(3);
    const intervalId = setInterval(() => {
      setOneTimeCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(intervalId);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [showRecurringConfirm]);

  const handlePayment = async ({ bypassConfirm = false } = {}) => {
    if (!isSignedIn) {
      router.push("/login");
      return;
    }


    if (!donationType) {
      alert("Please select a donation type.");
      return;
    }

    if (!selectedProjectId) {
      alert("Please select a project to donate to.");
      return;
    }

    if (!customAmount || customAmount < minAmount) {
      alert(`Please enter a valid donation amount (minimum ₹${minAmount}).`);
      return;
    }

    if (!isRecurring && !bypassConfirm) {
      setShowRecurringConfirm(true);
      return;
    }

    if (!isRazorpayReady) {
      alert("Payment system is still loading. Please try again in a moment.");
      return;
    }

    const selectedProject = projects.find((p) => p._id === selectedProjectId);

    if (isRecurring) {
      // Create subscription on the server and launch Razorpay Checkout with subscription_id
      try {
        const createRes = await fetch("/api/create-subscription", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: customAmount,
            frequency: donationFrequency,
            name,
            email,
          }),
        });

        const createData = await createRes.json();
        if (!createRes.ok) {
          console.error("Subscription creation failed:", createData);
          alert("Failed to create subscription. Please try again later.");
          return;
        }

        const subscriptionId = createData?.subscription?.id;
        if (!subscriptionId) {
          console.error("No subscription id returned:", createData);
          alert("Failed to initialize subscription. Please contact support.");
          return;
        }

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
          subscription_id: subscriptionId,
          name: "Jamiat Foundation",
          description: `Recurring donation for ${selectedProject?.title || "General Fund"}`,
          handler: async (response) => {
            console.log("Subscription success:", response);
            alert(
              `Subscription successful! Subscription ID: ${response.razorpay_subscription_id}`
            );

            // Save subscription record in your DB
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/save-donation`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                subscriptionId: response.razorpay_subscription_id,
                paymentId: response.razorpay_payment_id,
                amount: customAmount,
                donationType,
                donationFrequency: donationFrequency,
                projectId: selectedProjectId,
                name,
                email,
                dedicatedTo,
                message,
                requestCertificate,
                isRecurring: true,
              }),
            })
              .then((res) => res.json())
              .then((data) => console.log("Donation saved:", data))
              .catch((err) => console.error("Failed to save donation:", err));
          },
          prefill: {
            name: name,
            email: email,
          },
          notes: {
            projectId: selectedProjectId,
            donationType,
            donationFor,
            dedicatedTo,
            message,
            isRecurring,
            donationFrequency,
            requestCertificate,
          },
          theme: {
            color: "#059669",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (err) {
        console.error("Error creating subscription:", err);
        alert("Unable to create subscription. Please try again later.");
      }

      return;
    }

    // One-time payment flow (unchanged)
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
      amount: customAmount * 100,
      currency: "INR",
      name: "Jamiat Foundation",
      description: `Donation for ${selectedProject?.title || "General Fund"}`,
      handler: async (response) => {
        console.log("Payment success:", response);
        alert(
          `Payment successful! Payment ID: ${response.razorpay_payment_id}`
        );

        try {
          // 1️⃣ Capture the payment via backend
          const captureRes = await fetch("/api/capture-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              paymentId: response.razorpay_payment_id,
              amount: customAmount,
            }),
          });

          const captureData = await captureRes.json();
          if (!captureRes.ok) {
            console.error("Capture failed:", captureData);
            alert("Payment capture failed! Please contact support.");
            return;
          }

          console.log("Payment captured:", captureData);

          // 2️⃣ Save donation record in your DB
          await fetch(`${process.env.NEXT_PUBLIC_API_URL}/save-donation`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              paymentId: response.razorpay_payment_id,
              amount: customAmount,
              donationType,
              donationFrequency: isRecurring ? donationFrequency : "One-Time",
              projectId: selectedProjectId,
              name,
              email,
              dedicatedTo,
              message,
              requestCertificate,
            }),
          })
            .then((res) => res.json())
            .then((data) => console.log("Donation saved:", data))
            .catch((err) => console.error("Failed to save donation:", err));
        } catch (err) {
          console.error("Error during capture or save:", err);
        }
      },
      prefill: {
        name: name,
        email: email,
      },
      notes: {
        projectId: selectedProjectId,
        donationType,
        donationFor,
        dedicatedTo,
        message,
        isRecurring,
        donationFrequency,
        requestCertificate,
      },
      theme: {
        color: "#059669",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const selectedProject = projects.find((p) => p._id === selectedProjectId);
  const donationTypes =
    selectedProject?.donationOptions?.filter((opt) => opt.isEnabled) || [];

  return (
    <div className="min-h-screen bg-white">
      {/* Header Info Section */}
      <section className="max-w-7xl mx-auto px-4 pt-32 pb-8">
        <div className="space-y-4">
          <div className="inline-flex items-center px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium border border-emerald-100">
            <Users className="w-4 h-4 mr-2" />
            Social Welfare
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 font-serif">
            General Sadqa Fund
          </h1>
          <p className="max-w-2xl text-gray-600 leading-relaxed text-lg">
            Your Sadqa extinguishes sins as water extinguishes fire. Contribute
            to our general welfare fund to support orphans, widows, and those in
            immediate need across the community.
          </p>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Donation Form */}
          <div className="lg:flex-1 space-y-8">
            <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
              {/* Stepper Header */}
              <div className="grid grid-cols-3 border-b border-gray-100">
                <div className="flex items-center justify-center py-6 px-4 space-x-3 bg-emerald-50/30">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500 text-white text-sm font-bold">
                    1
                  </span>
                  <span className="font-semibold text-emerald-600 hidden sm:inline">Amount</span>
                </div>
                <div className="flex items-center justify-center py-6 px-4 space-x-3 text-gray-400">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-gray-200 text-sm font-bold">
                    2
                  </span>
                  <span className="font-semibold hidden sm:inline">Details</span>
                </div>
                <div className="flex items-center justify-center py-6 px-4 space-x-3 text-gray-400">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-gray-200 text-sm font-bold">
                    3
                  </span>
                  <span className="font-semibold hidden sm:inline">Payment</span>
                </div>
              </div>

              <div className="p-8 space-y-8">
                {/* Frequency Toggle */}
                <div className="flex justify-center">
                  <div className="inline-flex p-1 bg-gray-50 rounded-xl border border-gray-100">
                    <button
                      onClick={() => setIsRecurring(false)}
                      className={`px-8 py-2.5 rounded-lg font-medium transition-all ${!isRecurring
                        ? "bg-white text-gray-900 shadow-sm border border-gray-100"
                        : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                      Give Once
                    </button>
                    <button
                      onClick={() => setIsRecurring(true)}
                      className={`px-8 py-2.5 rounded-lg font-medium transition-all flex items-center ${isRecurring
                        ? "bg-white text-gray-900 shadow-sm border border-gray-100"
                        : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                      Monthly
                      <span className="ml-2 px-1.5 py-0.5 bg-rose-100 text-rose-600 text-[10px] font-bold rounded uppercase tracking-wider">
                        Impact
                      </span>
                    </button>
                  </div>
                </div>

                {/* Amount Selection */}
                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-gray-900">
                    Select Donation Amount
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[500, 1000, 2500, 5000].map((amount) => (
                      <button
                        key={amount}
                        onClick={() => setCustomAmount(amount)}
                        className={`py-4 rounded-xl border-2 transition-all font-bold text-lg ${customAmount === amount
                          ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                          : "border-gray-100 hover:border-emerald-200 text-gray-600"
                          }`}
                      >
                        ₹{amount.toLocaleString()}
                      </button>
                    ))}
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <IndianRupee className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                    </div>
                    <input
                      type="number"
                      placeholder="Enter custom amount"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(Number(e.target.value))}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-gray-900 font-medium text-lg"
                    />
                  </div>
                </div>

                {/* Donor Information */}
                <div className="space-y-6 pt-4">
                  <div className="flex items-center space-x-2 text-gray-900 font-bold border-b border-gray-50 pb-2">
                    <Users className="h-5 w-5 text-emerald-500" />
                    <span>Donor Information</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700 ml-1">First Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Yusuf"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-gray-900 placeholder:text-gray-400"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700 ml-1">Last Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Khan"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-gray-900 placeholder:text-gray-400"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700 ml-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="yusuf@example.com"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-gray-900 placeholder:text-gray-400"
                    />
                  </div>
                </div>

                {/* Options */}
                <div className="space-y-4 pt-2">
                  <label className="flex items-start p-5 bg-gray-50/50 rounded-2xl border border-gray-100 cursor-pointer hover:bg-emerald-50/30 transition-colors group">
                    <div className="flex items-center h-6">
                      <input
                        type="checkbox"
                        checked={requestCertificate}
                        onChange={() => setRequestCertificate(!requestCertificate)}
                        className="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 transition-all cursor-pointer accent-emerald-600"
                      />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors">
                        Add 3% to cover transaction fees
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Ensure 100% of your donation goes to the cause and help us cover administrative costs.
                      </p>
                    </div>
                  </label>
                </div>

                {/* Actions */}
                <div className="space-y-4">
                  <button
                    onClick={handlePayment}
                    className="w-full py-5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold text-lg flex items-center justify-center transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98]"
                  >
                    <Heart className="w-6 h-6 mr-2 fill-current" />
                    Donate Now
                  </button>
                  <div className="flex flex-wrap items-center justify-center gap-6 pt-2">
                    <div className="flex items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                      <Lock className="w-3 h-3 mr-2 text-emerald-500" />
                      256-bit SSL Secure
                    </div>
                    <div className="flex items-center space-x-4 grayscale opacity-40">
                      <img src="https://cdn-icons-png.flaticon.com/512/349/349221.png" alt="Visa" className="h-4" />
                      <img src="https://cdn-icons-png.flaticon.com/512/349/349228.png" alt="Mastercard" className="h-4" />
                      <img src="https://cdn.razorpay.com/logo.svg" alt="Razorpay" className="h-3" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Proof Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              <div className="flex items-start space-x-4 p-4 border border-gray-50 rounded-2xl hover:bg-gray-50/50 transition-colors">
                <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
                  <Check className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">100% Secure</h4>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    Your data is protected with enterprise-grade encryption protocols.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4 p-4 border border-gray-50 rounded-2xl hover:bg-gray-50/50 transition-colors">
                <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                  <ArrowUp className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">Transparent</h4>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    Annual reports available showing exactly where funds go.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4 p-4 border border-gray-50 rounded-2xl hover:bg-gray-50/50 transition-colors">
                <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
                  <Star className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">Tax Deductible</h4>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    We are a registered 501(c)(3) non-profit organization.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:w-[380px] space-y-8">
            {/* Zakat Calculator */}
            <div className="bg-emerald-50/50 border border-emerald-100 rounded-3xl p-8 space-y-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 -transe-y-4 transe-x-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                <IndianRupee className="w-32 h-32" />
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-emerald-100 rounded-lg text-emerald-700">
                  <LayoutDashboard className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">Zakat Calculator</h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Not sure how much you owe? Use our easy tool to calculate your
                obligation accurately.
              </p>
              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center text-sm font-medium py-2 border-b border-emerald-100/50">
                  <span className="text-gray-500">Gold Nisab</span>
                  <span className="text-gray-900">87.48g</span>
                </div>
                <div className="flex justify-between items-center text-sm font-medium py-2 border-b border-emerald-100/50">
                  <span className="text-gray-500">Silver Nisab</span>
                  <span className="text-gray-900">612.36g</span>
                </div>
              </div>
              <button className="w-full py-4 bg-white border border-emerald-100 text-emerald-700 rounded-2xl font-bold hover:bg-emerald-50 transition-all shadow-sm">
                Calculate My Zakat
              </button>
            </div>

            {/* Support Widget */}
            <div className="bg-white border border-gray-100 rounded-3xl p-8 space-y-6 shadow-sm">
              <h3 className="font-bold text-gray-900 text-lg">Need Help?</h3>
              <div className="space-y-4">
                <a href="tel:+15551234567" className="flex items-center space-x-4 p-3 rounded-2xl border border-gray-50 hover:bg-gray-50 transition-all group">
                  <div className="p-2.5 bg-gray-50 rounded-xl group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                    <Phone className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">+1 (555) 123-4567</span>
                </a>
                <a href="mailto:support@jamiat.org" className="flex items-center space-x-4 p-3 rounded-2xl border border-gray-50 hover:bg-gray-50 transition-all group">
                  <div className="p-2.5 bg-gray-50 rounded-xl group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">support@jamiat.org</span>
                </a>
              </div>

              <div className="pt-4">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Other ways to give</p>
                <div className="grid grid-cols-3 gap-2">
                  <button className="py-2 text-[11px] font-bold bg-gray-50 text-gray-500 rounded-xl border border-gray-100 hover:bg-gray-100 transition-all">Stock</button>
                  <button className="py-2 text-[11px] font-bold bg-gray-50 text-gray-500 rounded-xl border border-gray-100 hover:bg-gray-100 transition-all">Crypto</button>
                  <button className="py-2 text-[11px] font-bold bg-gray-50 text-gray-500 rounded-xl border border-gray-100 hover:bg-gray-100 transition-all">Check</button>
                </div>
              </div>
            </div>

            {/* Recent Donors */}
            <div className="bg-white border border-gray-100 rounded-3xl p-8 space-y-6 shadow-sm">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-gray-900 text-lg flex items-center">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 mr-2 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                  Recent Donors
                </h3>
              </div>
              <div className="space-y-4">
                {[
                  { name: "Muhammad K.", amount: 5000, initial: "MK", color: "bg-emerald-100 text-emerald-700" },
                  { name: "Fatima A.", amount: 2500, initial: "FA", color: "bg-blue-100 text-blue-700" },
                  { name: "Anonymous", amount: 10000, initial: "A", color: "bg-gray-100 text-gray-600" }
                ].map((donor, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 transition-all">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${donor.color}`}>
                        {donor.initial}
                      </div>
                      <span className="text-sm font-bold text-gray-700">{donor.name}</span>
                    </div>
                    <span className="text-sm font-bold text-emerald-600">₹{donor.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recurring Confirmation Popup */}
      {showRecurringConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full border border-gray-100 animate-fade-in">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 font-serif">
              Confirm One-Time Donation
            </h3>
            <p className="text-gray-600 mb-8 leading-relaxed">
              You have selected a one-time donation. Would you like to make this
              a recurring donation for consistent support and greater impact?
            </p>
            <div className="flex flex-col space-y-3">
              <button
                onClick={() => {
                  setShowRecurringConfirm(false);
                  handlePayment({ bypassConfirm: true });
                }}
                disabled={oneTimeCountdown > 0}
                className={`w-full py-4 rounded-2xl font-bold transition-all ${oneTimeCountdown > 0
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                  }`}
              >
                Continue with One-Time
                {oneTimeCountdown > 0 ? ` (${oneTimeCountdown}s)` : ""}
              </button>
              <button
                onClick={() => {
                  setIsRecurring(true);
                  setDonationFrequency("Monthly");
                  setShowRecurringConfirm(false);
                  handlePayment({ bypassConfirm: true });
                }}
                className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-500/20 transition-all"
              >
                Make it Recurring
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
