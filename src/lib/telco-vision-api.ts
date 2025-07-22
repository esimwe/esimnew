import axios from 'axios';

// API endpoint ve kimlik bilgileri
const API_BASE_URL = process.env.TELCO_VISION_API_URL || 'https://api.telco-vision.co/v1';
const API_KEY = process.env.TELCO_VISION_API_KEY || '';
const API_SECRET = process.env.TELCO_VISION_API_SECRET || '';

// API Client oluşturma
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_KEY}`,
    'X-API-Secret': API_SECRET
  }
});

// Hata işleme için interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('TelcoVision API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Reseller ve Hesap işlemleri
export const resellerService = {
  // Tüm hesapları listeler
  listResellerAccounts: async () => {
    try {
      const response = await apiClient.post('/', {
        listResellerAccount: {}
      });
      return response.data.listResellerAccount;
    } catch (error) {
      console.error('Error listing reseller accounts:', error);
      throw error;
    }
  },

  // Belirli bir reseller'ın hesaplarını listeler
  getResellerAccounts: async (resellerId: number) => {
    try {
      const response = await apiClient.post('/', {
        listResellerAccount: {
          resellerId
        }
      });
      return response.data.listResellerAccount;
    } catch (error) {
      console.error(`Error getting reseller (${resellerId}) accounts:`, error);
      throw error;
    }
  },

  // Reseller bilgilerini alır
  getResellerInfo: async (resellerId: number) => {
    try {
      const response = await apiClient.post('/', {
        getResellerInfo: {
          resellerId
        }
      });
      return response.data.getResellerInfo;
    } catch (error) {
      console.error(`Error getting reseller info (${resellerId}):`, error);
      throw error;
    }
  }
};

// Abone (Subscriber) işlemleri
export const subscriberService = {
  // Tek bir abone bilgisini alır
  getSingleSubscriber: async (subscriberId: number) => {
    try {
      const response = await apiClient.post('/', {
        getSingleSubscriber: {
          subscriberId
        }
      });
      return response.data.getSingleSubscriber;
    } catch (error) {
      console.error(`Error getting subscriber (${subscriberId}):`, error);
      throw error;
    }
  },

  // Aboneleri listeler
  listSubscribers: async (accountId: number) => {
    try {
      const response = await apiClient.post('/', {
        listSubscriber: {
          accountId
        }
      });
      return response.data.listSubscriber;
    } catch (error) {
      console.error(`Error listing subscribers for account (${accountId}):`, error);
      throw error;
    }
  },

  // Abone durumunu değiştirir
  modifySubscriberStatus: async (subscriberId: number, status: string) => {
    try {
      const response = await apiClient.post('/', {
        modifySubscriberStatus: {
          subscriberId,
          status
        }
      });
      return response.data.modifySubscriberStatus;
    } catch (error) {
      console.error(`Error modifying subscriber status (${subscriberId}):`, error);
      throw error;
    }
  },

  // Abone iletişim bilgilerini günceller
  modifySubscriberContactInfo: async (subscriberId: number, contactInfo: any) => {
    try {
      const response = await apiClient.post('/', {
        modifySubscriberContactInfo: {
          subscriberId,
          ...contactInfo
        }
      });
      return response.data.modifySubscriberContactInfo;
    } catch (error) {
      console.error(`Error modifying subscriber contact info (${subscriberId}):`, error);
      throw error;
    }
  }
};

// Prepaid paket işlemleri
export const packageService = {
  // Abone prepaid paketlerini listeler
  listSubscriberPrepaidPackages: async (subscriberId: number) => {
    try {
      const response = await apiClient.post('/', {
        listSubscriberPrepaidPackages: {
          subscriberId
        }
      });
      return response.data.listSubscriberPrepaidPackages;
    } catch (error) {
      console.error(`Error listing prepaid packages for subscriber (${subscriberId}):`, error);
      throw error;
    }
  },

  // Prepaid paket şablonlarını listeler
  listPrepaidPackageTemplates: async () => {
    try {
      const response = await apiClient.post('/', {
        listPrepaidPackageTemplate: {}
      });
      return response.data.listPrepaidPackageTemplate;
    } catch (error) {
      console.error('Error listing prepaid package templates:', error);
      throw error;
    }
  },

  // Aboneye paket ekler
  affectPackageToSubscriber: async (subscriberId: number, packageTemplateId: number) => {
    try {
      const response = await apiClient.post('/', {
        affectPackageToSubscriber: {
          subscriberId,
          packageTemplateId
        }
      });
      return response.data.affectPackageToSubscriber;
    } catch (error) {
      console.error(`Error affecting package to subscriber (${subscriberId}):`, error);
      throw error;
    }
  },

  // Aboneye tekrarlayan paket ekler
  affectRecurringPackageToSubscriber: async (subscriberId: number, packageTemplateId: number, options: any) => {
    try {
      const response = await apiClient.post('/', {
        affectRecurringPackageToSubscriber: {
          subscriberId,
          packageTemplateId,
          ...options
        }
      });
      return response.data.affectRecurringPackageToSubscriber;
    } catch (error) {
      console.error(`Error affecting recurring package to subscriber (${subscriberId}):`, error);
      throw error;
    }
  }
};

// Konum ve bölge işlemleri
export const locationService = {
  // Konum bölgelerini listeler
  listLocationZoneElements: async () => {
    try {
      const response = await apiClient.post('/', {
        listLocationZoneElement: {}
      });
      return response.data.listLocationZoneElement;
    } catch (error) {
      console.error('Error listing location zone elements:', error);
      throw error;
    }
  },

  // Detaylı konum bölgelerini listeler
  listDetailedLocationZones: async () => {
    try {
      const response = await apiClient.post('/', {
        listDetailedLocationZone: {}
      });
      return response.data.listDetailedLocationZone;
    } catch (error) {
      console.error('Error listing detailed location zones:', error);
      throw error;
    }
  },

  // Yeni bir konum bölgesi oluşturur
  createLocationZone: async (networkProfileId: number, locationZoneName: string, tadigList: string[]) => {
    try {
      const response = await apiClient.post('/', {
        createLocationZone: {
          networkProfileId,
          locationZoneName,
          tadigList
        }
      });
      return response.data.createLocationZone;
    } catch (error) {
      console.error('Error creating location zone:', error);
      throw error;
    }
  }
};

// İstatistik ve kullanım bilgileri
export const statsService = {
  // Abone aktif dönemini alır
  getSubscriberActivePeriod: async (subscriberId: number) => {
    try {
      const response = await apiClient.post('/', {
        getSubscriberActivePeriod: {
          subscriberId
        }
      });
      return response.data.getSubscriberActivePeriod;
    } catch (error) {
      console.error(`Error getting subscriber active period (${subscriberId}):`, error);
      throw error;
    }
  },

  // Belirli bir dönem için abone kullanımını alır
  subscriberUsageOverPeriod: async (subscriberId: number, startTime: string, endTime: string) => {
    try {
      const response = await apiClient.post('/', {
        subscriberUsageOverPeriod: {
          subscriberId,
          startTime,
          endTime
        }
      });
      return response.data.subscriberUsageOverPeriod;
    } catch (error) {
      console.error(`Error getting subscriber usage over period (${subscriberId}):`, error);
      throw error;
    }
  },

  // Belirli bir dönem için abone ağ olaylarını alır
  subscriberNetworkEventsOverPeriod: async (subscriberId: number, startTime: string, endTime: string) => {
    try {
      const response = await apiClient.post('/', {
        subscriberNetworkEventsOverPeriod: {
          subscriberId,
          startTime,
          endTime
        }
      });
      return response.data.subscriberNetworkEventsOverPeriod;
    } catch (error) {
      console.error(`Error getting subscriber network events over period (${subscriberId}):`, error);
      throw error;
    }
  }
};

// SMS gönderme işlemi
export const smsService = {
  // SMS gönderir
  sendMtSms: async (subscriberId: number, messageText: string) => {
    try {
      const response = await apiClient.post('/', {
        sendMtSms: {
          subscriberId,
          messageText
        }
      });
      return response.data.sendMtSms;
    } catch (error) {
      console.error(`Error sending SMS to subscriber (${subscriberId}):`, error);
      throw error;
    }
  }
};

// Ağ profili işlemleri
export const networkService = {
  // Ağ profillerini listeler
  listNetworkProfiles: async () => {
    try {
      const response = await apiClient.post('/', {
        listNetworkProfile: {}
      });
      return response.data.listNetworkProfile;
    } catch (error) {
      console.error('Error listing network profiles:', error);
      throw error;
    }
  }
};

// Ana hizmet dışa aktarma
export const telcoVisionApi = {
  resellerService,
  subscriberService,
  packageService,
  locationService,
  statsService,
  smsService,
  networkService
};

export default telcoVisionApi;
