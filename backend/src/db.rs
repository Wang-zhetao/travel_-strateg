use std::sync::Arc;
use parking_lot::RwLock;
use uuid::Uuid;
use crate::models::Guide;
use crate::error::Error;

// 简单的内存数据库，实际项目中可替换为真实数据库
pub struct Store {
    guides: RwLock<Vec<Guide>>,
}

impl Store {
    pub fn new() -> Self {
        Self {
            guides: RwLock::new(Vec::new()),
        }
    }

    pub fn create_guide(&self, mut guide: Guide) -> Result<Guide, Error> {
        // 确保ID是唯一的
        guide.id = Uuid::new_v4();
        let mut guides = self.guides.write();
        guides.push(guide.clone());
        Ok(guide)
    }

    pub fn get_guides(&self) -> Vec<Guide> {
        self.guides.read().clone()
    }

    pub fn get_guide(&self, id: Uuid) -> Result<Guide, Error> {
        let guides = self.guides.read();
        guides
            .iter()
            .find(|g| g.id == id)
            .cloned()
            .ok_or(Error::GuideNotFound)
    }

    pub fn update_guide(&self, id: Uuid, update: Guide) -> Result<Guide, Error> {
        let mut guides = self.guides.write();
        
        if let Some(index) = guides.iter().position(|g| g.id == id) {
            guides[index] = update.clone();
            Ok(update)
        } else {
            Err(Error::GuideNotFound)
        }
    }

    pub fn delete_guide(&self, id: Uuid) -> Result<(), Error> {
        let mut guides = self.guides.write();
        
        if let Some(index) = guides.iter().position(|g| g.id == id) {
            guides.remove(index);
            Ok(())
        } else {
            Err(Error::GuideNotFound)
        }
    }
}

// 创建全局数据存储
pub fn store() -> Arc<Store> {
    static INSTANCE: std::sync::OnceLock<Arc<Store>> = std::sync::OnceLock::new();
    INSTANCE.get_or_init(|| Arc::new(Store::new())).clone()
}
