import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './components/ui/dialog';
import { Button } from './components/ui/button';
import { UserCircle, Menu, X, Settings, Trophy, Star } from 'lucide-react';
import CreateOpportunityForm from './components/CreateOpportunityForm';
import ApplicationForm from './components/ApplicationForm';
import MyOpportunities from './components/MyOpportunities';
import { supabase } from './lib/supabase';
import AuthDialog from './components/AuthDialog';
import AboutDialog from './components/AboutDialog';
import { motion } from 'framer-motion';
import Logo from './components/Logo';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import UserProfile from './components/UserProfile';
import ViewProfile from './components/ViewProfile';
import { Badge } from './components/ui/badge';
import { Label } from './components/ui/label';
import { Switch } from './components/ui/switch';
import { useLanguage } from './contexts/LanguageContext';
import Leaderboard from './components/Leaderboard';
import SuccessStories from './components/SuccessStories';

const CATEGORIES = [
  'Miljø og Natur',
  'Barn og Ungdom',
  'Eldre og Omsorg',
  'Sport og Fritid',
  'Kultur og Kunst',
  'Utdanning',
  'Helse',
  'Annet'
];

const App = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [opportunities, setOpportunities] = useState([]);
  const [applications, setApplications] = useState([]);
  const [showMyOpportunities, setShowMyOpportunities] = useState(false);
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [locationFilter, setLocationFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showCreatorProfile, setShowCreatorProfile] = useState(false);
  const [selectedCreatorId, setSelectedCreatorId] = useState(null);
  const [selectedCreator, setSelectedCreator] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showSuccessStories, setShowSuccessStories] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const isExpired = (date) => {
    const opportunityDate = new Date(date);
    const today = new Date();
    opportunityDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return opportunityDate < today;
  };

  const fetchOpportunities = async () => {
    try {
      // Sample opportunities data
      const sampleOpportunities = [
        {
          id: 1,
          title: 'Fotballtrener for Barn',
          description: 'Idrettslaget søker frivillige trenere til barnelag (6-8 år). Ingen tidligere trenererfaring kreves, bare engasjement og glede av å jobbe med barn.',
          organization: 'SK Sport',
          location: 'Drøbak',
          date: '2024-04-01',
          time_slot: '17:00 - 18:30',
          category: 'Sport og Fritid',
          required_skills: ['Fotballinteresse', 'Barnevennlig', 'Engasjert'],
          contact_email: 'trener@sksport.no',
          contact_phone: '45622653',
          user_id: user?.id || '1',
          is_taken: false,
          created_at: new Date().toISOString(),
          creator: [{
            user_id: user?.id || '1',
            full_name: 'Thomas Nilsen',
            bio: 'Sportskoordinator med 10 års erfaring i barne- og ungdomsidrett. Brenner for å skape et inkluderende idrettsmiljø hvor alle barn kan utvikle seg og ha det gøy.',
            skills: ['Fotballtrening', 'Barneidrett', 'Teamledelse', 'Førstehjelpskurs'],
            avatar_url: null,
            contact_email: 'thomas@sksport.no',
            phone: '45622653'
          }]
        },
        {
          id: 2,
          title: 'Kunstworkshop for Barn',
          description: 'Vi arrangerer kreative workshops for barn på lørdager og trenger frivillige til å assistere med maling, tegning og andre kunstaktiviteter.',
          organization: 'Barnas Kunsthus',
          location: 'Ås',
          date: '2024-04-06',
          time_slot: '11:00 - 14:00',
          category: 'Kultur og Kunst',
          required_skills: ['Kreativ', 'Kunstinteresse', 'Barnevennlig'],
          contact_email: 'kunst@barnaskunsthus.no',
          contact_phone: '67891234',
          user_id: user?.id || '1',
          is_taken: false,
          created_at: new Date().toISOString(),
          creator: [{
            user_id: user?.id || '1',
            full_name: 'Lisa Andersen',
            bio: 'Utdannet kunstner og pedagog med fokus på barns kreative utvikling. Har ledet kunstworkshops i over 5 år og elsker å se barns kreativitet blomstre.',
            skills: ['Kunstundervisning', 'Maling', 'Tegning', 'Barnekunst', 'Pedagogikk'],
            avatar_url: null,
            contact_email: 'lisa@barnaskunsthus.no',
            phone: '67891234'
          }]
        },
        {
          id: 3,
          title: 'Matutdeling til Trengende',
          description: 'Vi trenger frivillige til å hjelpe med sortering og utdeling av mat til vanskeligstilte familier. Arbeidet innebærer også enkel matlaging og pakking av poser.',
          organization: 'MatHjelpen',
          location: 'Drøbak',
          date: '2024-03-27',
          time_slot: '16:00 - 19:00',
          category: 'Helse',
          required_skills: ['Organisert', 'Hygienisk', 'Serviceinnstilt'],
          contact_email: 'frivillig@mathjelpen.no',
          contact_phone: '46114521',
          user_id: user?.id || '1',
          is_taken: false,
          created_at: new Date().toISOString(),
          creator: [{
            user_id: user?.id || '1',
            full_name: 'Erik Olsen',
            bio: 'Grunnlegger av MatHjelpen med bakgrunn fra restaurantbransjen. Dedikert til å bekjempe matsvinn og hjelpe vanskeligstilte familier i lokalsamfunnet.',
            skills: ['Matvarehåndtering', 'Prosjektledelse', 'Logistikk', 'Matsikkerhet'],
            avatar_url: null,
            contact_email: 'erik@mathjelpen.no',
            phone: '46114521'
          }]
        }
      ];

      // First fetch real opportunities without joins
      const { data: realOpportunities, error } = await supabase
        .from('opportunities')
        .select('*');

      if (error) throw error;

      // Then fetch profiles for each opportunity
      const opportunitiesWithCreators = await Promise.all((realOpportunities || []).map(async (opportunity) => {
        const { data: creatorData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', opportunity.creator_id)
          .single();
        
        return {
          ...opportunity,
          creator: creatorData ? [creatorData] : []
        };
      }));

      // Combine real and sample opportunities
      const allOpportunities = [...opportunitiesWithCreators, ...sampleOpportunities];
      console.log('All opportunities:', allOpportunities);
      setOpportunities(allOpportunities);
    } catch (error) {
      console.error('Error fetching opportunities:', error);
    }
  };

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*, opportunity_id, status')
        .eq('user_id', user?.id);

      if (error) throw error;
      if (data) setApplications(data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const cleanupExpiredOpportunities = async () => {
    try {
      const { error } = await supabase
        .from('opportunities')
        .update({ is_taken: true })
        .lt('date', new Date().toISOString().split('T')[0]);

      if (error) throw error;
    } catch (error) {
      console.error('Error cleaning up expired opportunities:', error);
    }
  };

  const filterOpportunitiesByAll = (opportunities, applications) => {
    return opportunities
      .filter(opportunity => {
        if (searchQuery) {
          const searchLower = searchQuery.toLowerCase();
          const matchesSearch = 
            opportunity.title.toLowerCase().includes(searchLower) ||
            opportunity.description.toLowerCase().includes(searchLower) ||
            opportunity.organization.toLowerCase().includes(searchLower) ||
            opportunity.required_skills.some(skill => 
              skill.toLowerCase().includes(searchLower)
            );
          
          if (!matchesSearch) return false;
        }

        if (locationFilter && !opportunity.location.toLowerCase().includes(locationFilter.toLowerCase())) {
          return false;
        }
        
        if (dateFilter && opportunity.date !== dateFilter) {
          return false;
        }

        if (categoryFilter && categoryFilter !== 'all' && opportunity.category !== categoryFilter) {
          return false;
        }
        
        return true;
      });
  };

  const getApplicationStatus = (opportunityId) => {
    if (!user) return null;
    const application = applications.find(app => app.opportunity_id === opportunityId);
    return application?.status;
  };

  const getUserDisplayName = (email) => {
    if (!email) return '';
    const name = email.split('@')[0];
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  const getCategoryStyle = (category) => {
    const styles = {
      'Miljø og Natur': 'bg-green-100 text-green-800',
      'Barn og Ungdom': 'bg-blue-100 text-blue-800',
      'Eldre og Omsorg': 'bg-purple-100 text-purple-800',
      'Sport og Fritid': 'bg-yellow-100 text-yellow-800',
      'Kultur og Kunst': 'bg-pink-100 text-pink-800',
      'Utdanning': 'bg-indigo-100 text-indigo-800',
      'Helse': 'bg-red-100 text-red-800',
      'Annet': 'bg-gray-100 text-gray-800'
    };
    return styles[category] || styles['Annet'];
  };

  useEffect(() => {
    fetchOpportunities();
    if (user) {
      fetchApplications();
    } else {
      setApplications([]);
    }

    cleanupExpiredOpportunities();

    const dailyCleanup = setInterval(() => {
      cleanupExpiredOpportunities();
      fetchOpportunities();
    }, 24 * 60 * 60 * 1000);

    const opportunitySubscription = supabase
      .channel('opportunities_changes')
      .on('postgres_changes', 
        { 
          event: '*',
          schema: 'public', 
          table: 'opportunities' 
        },
        (payload) => {
          switch (payload.eventType) {
            case 'INSERT':
              if (!payload.new.is_taken && !isExpired(payload.new.date)) {
                setOpportunities(prev => [payload.new, ...prev]);
              }
              break;
            case 'DELETE':
              setOpportunities(prev => prev.filter(opp => opp.id !== payload.old.id));
              break;
            case 'UPDATE':
              if (payload.new.is_taken || isExpired(payload.new.date)) {
                setOpportunities(prev => prev.filter(opp => opp.id !== payload.new.id));
              } else {
                setOpportunities(prev => prev.map(opp => 
                  opp.id === payload.new.id ? payload.new : opp
                ));
              }
              break;
            default:
              fetchOpportunities();
          }
        }
      )
      .subscribe();

    const applicationSubscription = supabase
      .channel('all_applications_changes')
      .on('postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'applications'
        },
        async (payload) => {
          if (user && payload.new.user_id === user.id) {
            switch (payload.eventType) {
              case 'INSERT':
                setApplications(prev => [payload.new, ...prev]);
                break;
              case 'DELETE':
                setApplications(prev => prev.filter(app => app.id !== payload.old.id));
                break;
              case 'UPDATE':
                setApplications(prev => prev.map(app => 
                  app.id === payload.new.id ? payload.new : app
                ));
                break;
              default:
                if (user) fetchApplications();
            }
          }
        }
      )
      .subscribe();

    return () => {
      clearInterval(dailyCleanup);
      opportunitySubscription.unsubscribe();
      applicationSubscription.unsubscribe();
    };
  }, [user]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    fetchOpportunities();

    // Set up real-time subscription for opportunities
    const subscription = supabase
      .channel('public:opportunities')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'opportunities'
        },
        (payload) => {
          console.log('Opportunity change:', payload);
          switch (payload.eventType) {
            case 'UPDATE':
              setOpportunities(prev => prev.map(opp => 
                opp.id === payload.new.id ? { ...opp, ...payload.new } : opp
              ));
              break;
            case 'DELETE':
              setOpportunities(prev => prev.filter(opp => opp.id !== payload.old.id));
              break;
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleApplyClick = (opportunity) => {
    if (!user) {
      setShowAuth(true);
      return;
    }
    setSelectedOpportunity(opportunity);
    setShowApplicationForm(true);
  };

  const hasApplied = (opportunityId) => {
    if (!user) return false;
    return applications.some(app => 
      app.opportunity_id === opportunityId && 
      app.user_id === user.id
    );
  };

  const handleCreatorClick = (userId, creator) => {
    setSelectedCreatorId(userId);
    setSelectedCreator(creator);
    setShowCreatorProfile(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#1a365d] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
            <div className="flex items-center justify-between">
              <Logo />
              <motion.div
                className="hidden sm:flex items-center space-x-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Button
                  variant="ghost"
                  onClick={() => setShowLeaderboard(true)}
                  className="text-white hover:bg-[#2a4365]"
                >
                  <Trophy className="h-5 w-5 mr-2" />
                  Toppliste
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setShowSuccessStories(true)}
                  className="text-white hover:bg-[#2a4365]"
                >
                  <Star className="h-5 w-5 mr-2" />
                  Suksesshistorier
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setShowAbout(true)}
                  className="text-white hover:bg-[#2a4365]"
                >
                  {t('aboutUs')}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowSettings(true)}
                  className="text-white hover:bg-[#2a4365]"
                >
                  <Settings className="h-5 w-5" />
                </Button>
              </motion.div>
              
              <Button
                variant="ghost"
                size="icon"
                className="sm:hidden text-white"
                onClick={() => setShowMobileMenu(true)}
              >
                <Menu className="h-6 w-6" />
              </Button>
            </div>

            <motion.div 
              className="hidden sm:flex items-center space-x-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              {user && (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => setShowProfile(true)}
                    className="text-white hover:bg-[#2a4365]"
                  >
                    <UserCircle className="h-5 w-5 mr-2" />
                    {getUserDisplayName(user.email)}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setShowMyOpportunities(true)}
                    className="text-white hover:bg-[#2a4365]"
                  >
                    {t('myOpportunities')}
                  </Button>
                  <Button 
                    variant="ghost"
                    onClick={() => supabase.auth.signOut()}
                    className="text-white hover:bg-[#2a4365]"
                  >
                    {t('logOut')}
                  </Button>
                </>
              )}
              {!user && (
                <Button
                  onClick={() => setShowAuth(true)}
                  className="bg-white text-[#1a365d] hover:bg-gray-100"
                >
                  Logg Inn
                </Button>
              )}
            </motion.div>

            <Dialog open={showMobileMenu} onOpenChange={setShowMobileMenu}>
              <DialogContent className="fixed top-[40%] right-[10%] w-[80%] max-w-sm h-auto max-h-[80vh] bg-[#1a365d] p-6 border-0 rounded-lg shadow-xl overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-white">Meny</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col text-white space-y-6 mt-4">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setShowLeaderboard(true);
                      setShowMobileMenu(false);
                    }}
                    className="text-white hover:bg-[#2a4365] justify-start w-full"
                  >
                    <Trophy className="h-5 w-5 mr-2" />
                    Toppliste
                  </Button>

                  <Button
                    variant="ghost"
                    onClick={() => {
                      setShowSuccessStories(true);
                      setShowMobileMenu(false);
                    }}
                    className="text-white hover:bg-[#2a4365] justify-start w-full"
                  >
                    <Star className="h-5 w-5 mr-2" />
                    Suksesshistorier
                  </Button>

                  <Button
                    variant="ghost"
                    onClick={() => {
                      setShowAbout(true);
                      setShowMobileMenu(false);
                    }}
                    className="text-white hover:bg-[#2a4365] justify-start w-full"
                  >
                    {t('aboutUs')}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setShowSettings(true);
                      setShowMobileMenu(false);
                    }}
                    className="text-white hover:bg-[#2a4365] justify-start w-full"
                  >
                    <Settings className="h-5 w-5 mr-2" />
                    {t('settings')}
                  </Button>
                  
                  {user && (
                    <div className="px-2 py-1 text-white font-medium border-b border-white/10">
                      Hei, {getUserDisplayName(user.email)}
                    </div>
                  )}
                  
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setShowMyOpportunities(true);
                      setShowMobileMenu(false);
                    }}
                    className="text-white hover:bg-[#2a4365] justify-start w-full"
                  >
                    {t('myOpportunities')}
                  </Button>

                  {user && (
                    <>
                      <Button
                        onClick={() => {
                          setShowProfile(true);
                          setShowMobileMenu(false);
                        }}
                        className="text-white hover:bg-[#2a4365] justify-start w-full"
                      >
                        <UserCircle className="h-5 w-5 mr-2" />
                        {t('myProfile')}
                      </Button>
                      <Button
                        onClick={() => {
                          setShowCreateForm(true);
                          setShowMobileMenu(false);
                        }}
                        className="bg-white text-[#1a365d] hover:bg-gray-100 justify-start w-full"
                      >
                        Legg Ut Mulighet
                      </Button>
                      <Button 
                        variant="ghost"
                        onClick={() => {
                          supabase.auth.signOut();
                          setShowMobileMenu(false);
                        }}
                        className="text-white hover:bg-[#2a4365] justify-start w-full"
                      >
                        {t('logOut')}
                      </Button>
                    </>
                  )}
                  {!user && (
                    <Button
                      onClick={() => {
                        setShowAuth(true);
                        setShowMobileMenu(false);
                      }}
                      className="bg-white text-[#1a365d] hover:bg-gray-100 justify-start w-full"
                    >
                      Logg Inn
                    </Button>
                  )}
                </div>
                
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-3">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-[#1a365d]">Frivillige Muligheter</h1>
                {user && (
                  <Button onClick={() => setShowCreateForm(true)}>
                    Legg Ut Mulighet
                  </Button>
                )}
              </div>
              <div className="mb-8 space-y-4">
                <h2 className="text-xl font-semibold text-[#1a365d]">{t('filterOpportunities')}</h2>
                <div className="space-y-2">
                  <label htmlFor="search" className="text-sm font-medium text-gray-700">
                    {t('search')}
                  </label>
                  <input
                    id="search"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('searchPlaceholder')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1a365d] focus:border-[#1a365d]"
                  />
                </div>
                <div className="flex overflow-x-auto pb-2 sm:grid sm:grid-cols-3 gap-4 -mx-4 px-4 sm:mx-0 sm:px-0">
                  <div className="flex-shrink-0 w-[280px] sm:w-auto space-y-2">
                    <label htmlFor="location-filter" className="text-sm font-medium text-gray-700">
                      {t('location')}
                    </label>
                    <input
                      id="location-filter"
                      type="text"
                      value={locationFilter}
                      onChange={(e) => setLocationFilter(e.target.value)}
                      placeholder={t('locationPlaceholder')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1a365d] focus:border-[#1a365d]"
                    />
                  </div>
                  <div className="flex-shrink-0 w-[280px] sm:w-auto space-y-2 ml-4 sm:ml-0">
                    <label htmlFor="date-filter" className="text-sm font-medium text-gray-700">
                      {t('date')}
                    </label>
                    <input
                      id="date-filter"
                      type="date"
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1a365d] focus:border-[#1a365d]"
                    />
                  </div>
                  <div className="flex-shrink-0 w-[280px] sm:w-auto space-y-2 ml-4 sm:ml-0">
                    <label htmlFor="category-filter" className="text-sm font-medium text-gray-700">
                      {t('category')}
                    </label>
                    <Select
                      value={categoryFilter}
                      onValueChange={setCategoryFilter}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={t('allCategories')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t('allCategories')}</SelectItem>
                        {CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>
                            {t(`categories.${category}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {(locationFilter || dateFilter || categoryFilter || searchQuery) && (
                  <button
                    onClick={() => {
                      setLocationFilter('');
                      setDateFilter('');
                      setCategoryFilter('all');
                      setSearchQuery('');
                    }}
                    className="text-sm text-[#1a365d] hover:underline"
                  >
                    {t('resetFilters')}
                  </button>
                )}
              </div>

              <motion.div 
                className="grid grid-cols-1 gap-4 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {filterOpportunitiesByAll(opportunities, applications).map((opportunity, index) => (
                  <motion.div
                    key={opportunity.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.5,
                      delay: index * 0.1,
                      type: "spring",
                      stiffness: 100
                    }}
                    whileHover={{ 
                      y: -5,
                      transition: { duration: 0.2 }
                    }}
                    className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-200 overflow-hidden border border-gray-100"
                  >
                    <div className="p-6">
                      <div className="relative">
                        <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#1a365d]/10 rounded-full blur-2xl"></div>
                        <div className="flex justify-between items-start">
                          <div>
                            <h2 className="text-xl font-semibold text-[#1a365d] relative z-10 font-heading tracking-wide">
                              {opportunity.title}
                            </h2>
                            <p className="mt-2 text-sm text-gray-600 font-sans">
                              {opportunity.organization}
                            </p>
                          </div>
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${getCategoryStyle(opportunity.category)}`}>
                            {opportunity.category}
                          </span>
                        </div>
                      </div>
                      
                      <p className="mt-3 text-gray-700 line-clamp-3 relative">
                        {opportunity.description}
                      </p>
                      
                      <div className="mt-4 space-y-3 relative">
                        <div className="flex items-center text-sm text-gray-600 bg-gray-50 p-2 rounded-md">
                          <span className="font-medium text-[#1a365d]">{t('postedBy')}</span>
                          <div 
                            className="flex items-center ml-2 cursor-pointer group"
                            onClick={() => handleCreatorClick(opportunity.user_id, opportunity.creator?.[0])}
                          >
                            {opportunity.creator?.[0]?.avatar_url ? (
                              <img
                                src={opportunity.creator[0].avatar_url}
                                alt="Creator"
                                className="w-6 h-6 rounded-full object-cover transition-transform group-hover:scale-105"
                              />
                            ) : (
                              <UserCircle className="w-6 h-6 text-gray-400 transition-transform group-hover:scale-105" />
                            )}
                            <span className="ml-2 group-hover:text-[#1a365d] transition-colors">
                              {opportunity.creator?.[0]?.full_name || opportunity.organization}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 bg-gray-50 p-2 rounded-md">
                          <span className="font-medium text-[#1a365d]">{t('location')}</span>
                          <span className="ml-2">{opportunity.location}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 bg-gray-50 p-2 rounded-md">
                          <span className="font-medium text-[#1a365d]">{t('date')}</span>
                          <span className="ml-2">{new Date(opportunity.date).toLocaleDateString('nb-NO')}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 bg-gray-50 p-2 rounded-md">
                          <span className="font-medium text-[#1a365d]">{t('time')}</span>
                          <span className="ml-2">{opportunity.time_slot}</span>
                        </div>

                        <div className="pt-3 mt-3 border-t border-gray-100">
                          <h3 className="text-sm font-medium text-[#1a365d] mb-2 font-heading">
                            {t('contactInfo')}
                          </h3>
                          <div className="space-y-1 bg-blue-50 p-3 rounded-md">
                            <p className="text-sm text-gray-600">
                              <span className="font-medium text-[#1a365d]">{t('email')}</span>{' '}
                              <a 
                                href={`mailto:${opportunity.contact_email}`} 
                                className="text-blue-600 hover:underline"
                              >
                                {opportunity.contact_email}
                              </a>
                            </p>
                            {opportunity.contact_phone && (
                              <p className="text-sm text-gray-600">
                                <span className="font-medium text-[#1a365d]">{t('phone')}</span>{' '}
                                <a 
                                  href={`tel:${opportunity.contact_phone}`}
                                  className="text-blue-600 hover:underline"
                                >
                                  {opportunity.contact_phone}
                                </a>
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {opportunity.required_skills && opportunity.required_skills.length > 0 && (
                        <div className="mt-4">
                          <h3 className="text-sm font-medium text-[#1a365d] mb-2">{t('requiredSkills')}</h3>
                          <div className="flex flex-wrap gap-2">
                            {opportunity.required_skills.map((skill, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="mt-6 flex justify-end">
                        <Dialog 
                          open={selectedOpportunity?.id === opportunity.id && showApplicationForm}
                          onOpenChange={(open) => {
                            setShowApplicationForm(open);
                            if (!open) setSelectedOpportunity(null);
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button
                              onClick={() => {
                                if (!user) {
                                  setShowAuth(true);
                                  return;
                                }
                                setSelectedOpportunity(opportunity);
                                setShowApplicationForm(true);
                              }}
                              className={`w-full sm:w-auto ${
                                getApplicationStatus(opportunity.id) === 'approved'
                                  ? 'bg-green-600 hover:bg-green-700'
                                  : getApplicationStatus(opportunity.id) === 'rejected'
                                  ? 'bg-red-600 hover:bg-red-700'
                                  : hasApplied(opportunity.id)
                                  ? 'bg-yellow-600 hover:bg-yellow-700'
                                  : ''
                              }`}
                              disabled={hasApplied(opportunity.id)}
                            >
                              {getApplicationStatus(opportunity.id) === 'approved'
                                ? t('approved')
                                : getApplicationStatus(opportunity.id) === 'rejected'
                                ? t('rejected')
                                : hasApplied(opportunity.id)
                                ? t('applicationSent')
                                : user ? t('applyNow') : 'Logg inn for å søke'}
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Søk på: {opportunity.title}</DialogTitle>
                            </DialogHeader>
                            <ApplicationForm
                              opportunity={opportunity}
                              onApplicationSubmitted={() => {
                                setShowApplicationForm(false);
                                setSelectedOpportunity(null);
                                fetchApplications();
                              }}
                              onClose={() => {
                                setShowApplicationForm(false);
                                setSelectedOpportunity(null);
                              }}
                            />
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      {/* Add MyOpportunities dialog */}
      <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
        <DialogContent className="w-[90vw] max-w-[500px] max-h-[85vh] overflow-y-auto md:w-[85vw] md:max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Legg Ut Mulighet
            </DialogTitle>
          </DialogHeader>
          <div className="px-1 py-2">
            <CreateOpportunityForm 
              onOpportunityCreated={() => {
                setShowCreateForm(false);
                fetchOpportunities();
              }} 
            />
          </div>
        </DialogContent>
      </Dialog>

      <MyOpportunities 
        isOpen={showMyOpportunities}
        onClose={() => setShowMyOpportunities(false)}
      />

      <AuthDialog 
        isOpen={showAuth} 
        onClose={() => setShowAuth(false)} 
      />

      <AboutDialog 
        isOpen={showAbout}
        onClose={() => setShowAbout(false)}
      />

      {/* Add UserProfile dialog */}
      <UserProfile
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
      />

      <ViewProfile
        isOpen={showCreatorProfile}
        onClose={() => {
          setShowCreatorProfile(false);
          setSelectedCreatorId(null);
          setSelectedCreator(null);
        }}
        userId={selectedCreatorId}
        creator={selectedCreator}
      />

      {/* Add Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="w-[90vw] max-w-[500px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">{t('settings')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500">{t('appearance')}</h3>
              <div className="space-y-2">
                <Label>{t('language')}</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nb">Norsk bokmål</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500">{t('notifications')}</h3>
              <div className="flex items-center justify-between">
                <Label>{t('emailNotifications')}</Label>
                <Switch />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500">{t('privacy')}</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  {t('privacySettings')}
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  {t('dataHandling')}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Leaderboard dialog */}
      <Dialog open={showLeaderboard} onOpenChange={setShowLeaderboard}>
        <DialogContent className="w-[90vw] max-w-[800px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold flex items-center gap-2">
              <Trophy className="h-6 w-6 text-[#1a365d]" />
              Toppliste - Frivillige
            </DialogTitle>
          </DialogHeader>
          <Leaderboard />
        </DialogContent>
      </Dialog>

      {/* Add Success Stories dialog */}
      <SuccessStories 
        isOpen={showSuccessStories}
        onClose={() => setShowSuccessStories(false)}
      />
    </div>
  );
};

export default App;
